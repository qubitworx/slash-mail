use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use log::info;

use crate::{functions::manual_lock::ManualLock, prisma::PrismaClient};

use super::Mailer;

pub type MailerPoolType = HashMap<String, Mailer>;

#[derive(Clone)]
pub struct MailerPool {
    pub client: Arc<PrismaClient>,
    pub pools: MailerPoolType,
    pub last_used: Arc<Mutex<Option<String>>>,
}

impl MailerPool {
    pub async fn new(client: Arc<PrismaClient>) -> anyhow::Result<Self> {
        let pools = HashMap::new();

        Ok(Self {
            client,
            pools,
            last_used: Arc::new(Mutex::new(None)),
        })
    }

    pub async fn add_mailer(&mut self) -> anyhow::Result<()> {
        let mailer = Mailer::new(self.client.clone()).await?;

        let mut pools = self.pools.clone();
        let m = mailer.clone();

        pools.insert(mailer.identifier.clone(), m);

        self.pools = pools;

        Ok(())
    }

    /// Get a mailer from the pool.
    /// If no mailer is available, wait for a mailer to be available.
    /// NOTE: This is a blocking call.
    /// TODO: Add a timeout to this.

    pub async fn get_mailer(&self) -> anyhow::Result<Mailer> {
        let pools = &self.pools;
        let last_used = self.last_used.lock().unwrap();

        if last_used.is_none() {
            return Ok(pools.values().next().unwrap().clone());
        } else {
            let last_used = last_used.as_ref().unwrap();

            // get the index of the last used mailer and get the next one.
            let keys = pools.keys().collect::<Vec<&String>>();
            let mut index = keys.iter().position(|&r| r == last_used).unwrap();

            if index == (pools.len() - 1) {
                index = 0;
            }

            let key = keys[index];

            let mailer = pools.get(key).unwrap().clone();

            let mut last_used = self.last_used.lock().unwrap();
            *last_used = Some(key.clone());

            Ok(mailer)
        }
    }
}
