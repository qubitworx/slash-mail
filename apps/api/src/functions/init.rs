use std::{collections::HashMap, sync::Arc};

use crate::prisma::PrismaClient;

const EMAIL_VERIFY_TEMPLATE: &str = include_str!("../templates/email_verify.html");
const EMAIL_VERIFY_TEMPLATE_JSON: &str = include_str!("../templates/email_verify.json");
const DEFAULT_TEMPLATE: &str = include_str!("../templates/default.html");
const DEFAULT_TEMPLATE_JSON: &str = include_str!("../templates/default.json");

pub async fn initialize_db(client: Arc<PrismaClient>) -> anyhow::Result<()> {
    log::info!("Initializing database...");

    let mut default_settings = HashMap::new();

    default_settings.insert("name", "SlashMail");
    default_settings.insert("api_url", "http://localhost:8000");
    default_settings.insert("web_url", "http://localhost:3000");
    default_settings.insert(
        "description",
        "SlashMail is a simple email client for the modern web.",
    );
    default_settings.insert("logo", "/logo.png");

    log::info!("Creating default settings...");
    let settings = client.settings().find_many(vec![]).exec().await?;

    log::info!("Checking for missing settings...");
    for (key, value) in default_settings {
        if settings.iter().find(|s| s.key == key).is_none() {
            log::info!("Creating default setting: {}", key);
            client
                .settings()
                .create(key.to_string(), value.to_string(), vec![])
                .exec()
                .await
                .expect("Failed to create default settings.");
        }
    }

    log::info!("Creating default email templates...");
    let templates = client.template().find_many(vec![]).exec().await?;

    if templates
        .iter()
        .find(|t| t.identifier == "email-verify")
        .is_none()
    {
        log::info!("Creating default email template: email_verify");
        client
            .template()
            .create(
                "Email Verification".to_string(),
                "email-verify".to_string(),
                EMAIL_VERIFY_TEMPLATE.to_string(),
                EMAIL_VERIFY_TEMPLATE_JSON.to_string(),
                vec![],
            )
            .exec()
            .await
            .expect("Failed to create default email template.");
    }

    if templates
        .iter()
        .find(|t| t.identifier == "default")
        .is_none()
    {
        log::info!("Creating default email template: default");
        client
            .template()
            .create(
                "Default".to_string(),
                "default".to_string(),
                DEFAULT_TEMPLATE.to_string(),
                DEFAULT_TEMPLATE_JSON.to_string(),
                vec![],
            )
            .exec()
            .await
            .expect("Failed to create default email template.");
    }

    Ok(())
}
