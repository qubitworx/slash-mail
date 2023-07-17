pub mod pool;

use std::{collections::HashMap, sync::Arc};

use lettre::{
    message::header::ContentType,
    transport::smtp::{
        authentication::{Credentials, Mechanism},
        client::Tls,
        PoolConfig,
    },
    Message, SmtpTransport, Transport,
};

use crate::{
    crypto::decrypt,
    prisma::{self},
};

/// A pool of SMTP connections. The key is the SMTP email, and the value is a vector of smtp connections.
/// We don't need to use a Mutex as we only write to the pool once, and then only read from it.
/// Even if we are writing to the pool, we are mainly triggering it in the web interface and that happens rarely.
pub type Pool = HashMap<String, SmtpTransport>;

#[derive(Clone)]
pub struct Mailer {
    pub pool: Pool,
    pub smtp: Vec<prisma::smtp_settings::Data>,
    pub client: Arc<prisma::PrismaClient>,
    pub identifier: String,
}

impl Mailer {
    pub async fn new(client: Arc<prisma::PrismaClient>) -> anyhow::Result<Self> {
        let smtp_settings = client.smtp_settings().find_many(vec![]).exec().await?;

        // Let us start by creating a pool of SMTP connections, based on the SMTP settings.
        let pool = HashMap::new();

        let mut mailer = Self {
            pool,
            smtp: smtp_settings.clone(),
            client,
            identifier: uuid::Uuid::new_v4().to_string(),
        };

        mailer.create_pool(smtp_settings).await?;

        Ok(mailer)
    }

    async fn create_pool(
        &mut self,
        smtp_settings: Vec<prisma::smtp_settings::Data>,
    ) -> anyhow::Result<()> {
        // We lock the pool, so that we can add new connections to it.
        let mut pool = self.pool.clone();

        log::info!("Creating pool of SMTP connections.");

        // We iterate over the SMTP settings, and create a connections based on the settings.
        for smtp in smtp_settings.iter() {
            let transport = self.create_smtp_connection(smtp.clone()).await?;

            // We add the connection to the pool.
            pool.insert(smtp.smtp_user.clone(), transport);
        }

        self.pool = pool;

        Ok(())
    }

    async fn create_smtp_connection(
        &self,
        smtp: prisma::smtp_settings::Data,
    ) -> anyhow::Result<SmtpTransport> {
        let creds = Credentials::new(smtp.smtp_user.clone(), decrypt(smtp.smtp_pass.clone()));

        let mut mailer = lettre::SmtpTransport::relay(&smtp.smtp_host)
            .unwrap()
            .credentials(creds.clone());

        // First we check if TLS is enabled and if so, what type of TLS is required.
        // We directly overwrite the mailer.
        match smtp.smtp_tls {
            true => {
                // Can be NONE, STARTTLS, SxSL
                match smtp.tls.as_str() {
                    "starttls" => {
                        mailer = lettre::SmtpTransport::starttls_relay(&smtp.smtp_host)
                            .unwrap()
                            .credentials(creds);
                    }
                    "ssl/tls" => {
                        mailer = lettre::SmtpTransport::relay(&smtp.smtp_host)
                            .unwrap()
                            .credentials(creds);
                    }
                    "none" => {
                        mailer = mailer.tls(Tls::None); // TODO: Check if this is correct.
                    }
                    "off" => {
                        mailer = mailer.tls(Tls::None); // TODO: Check if this is correct.
                    }
                    _ => {
                        unimplemented!()
                    }
                }
            }
            false => {
                mailer = mailer.tls(Tls::None);
            }
        }

        if smtp.helo_host != "" {
            mailer = mailer.hello_name(lettre::transport::smtp::extension::ClientId::Domain(
                smtp.helo_host.clone(),
            ));
        }

        match smtp.auth_protocol.as_str() {
            "plain" => {
                mailer = mailer.authentication(vec![Mechanism::Plain]);
            }
            "login" => {
                mailer = mailer.authentication(vec![Mechanism::Login]);
            }
            "xoauth2" => {
                mailer = mailer.authentication(vec![Mechanism::Xoauth2]);
            }

            _ => mailer = mailer.authentication(vec![Mechanism::Login]),
        };

        // Create a pool config, based on the SMTP settings.
        let pool_config = PoolConfig::new()
            .max_size(smtp.max_connections.try_into().unwrap())
            .idle_timeout(std::time::Duration::from_secs(
                smtp.idle_timeout.try_into().unwrap(),
            ));

        // TODO: Add morre options to the mailer.
        mailer = mailer.pool_config(pool_config);

        let mailer = mailer.build();

        Ok(mailer)
    }

    async fn send_mail(
        &self,
        address: String,
        to: String,
        subject: String,
        body: String,
    ) -> anyhow::Result<()> {
        let pool_lock = self.pool.clone();

        let pool = pool_lock.get(&address).unwrap();

        let smtp = self.smtp.iter().find(|s| s.smtp_user == address);

        if smtp.is_none() {
            return Err(anyhow::anyhow!("SMTP settings not found."));
        }

        let smtp = smtp.as_ref().unwrap();

        let email = Message::builder()
            .from(smtp.smtp_from.parse().unwrap())
            .to(to.parse().unwrap())
            .subject(subject)
            .header(ContentType::TEXT_PLAIN)
            .body(body)
            .unwrap();

        pool.send(&email).unwrap();

        Ok(())
    }
}
