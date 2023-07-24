use std::{collections::HashMap, sync::Arc};

use crate::prisma::PrismaClient;

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

    Ok(())
}
