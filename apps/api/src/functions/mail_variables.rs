use std::{collections::HashMap, sync::Arc};

use crate::prisma::{self, PrismaClient};

#[derive(Clone)]
pub struct MailVariables {
    pub client: Arc<PrismaClient>,
}

impl MailVariables {
    pub async fn new(client: Arc<PrismaClient>) -> anyhow::Result<Self> {
        Ok(Self { client })
    }

    /// Build the variables for the verification email
    /// This is used when a user is registered to a list with "REQUIRES_CONFIRMATION"
    pub async fn build_variables(
        &self,
        subscriber: &prisma::subscriber::Data,
        list: &prisma::list::Data,
    ) -> anyhow::Result<HashMap<String, HashMap<String, String>>> {
        let mut hashmap = HashMap::new();
        hashmap.insert(
            "subscriber".to_string(),
            self.convert_to_hashmap(subscriber)?,
        );
        hashmap.insert("list".to_string(), self.convert_to_hashmap(list)?);

        let settings = self
            .client
            .settings()
            .find_first(vec![prisma::settings::key::equals("web_url".to_string())])
            .exec()
            .await?;

        if let Some(settings) = settings {
            let confirmation_setting = self
                .client
                .list_confirmation()
                .create(
                    prisma::list::id::equals(list.id.clone()),
                    prisma::subscriber::id::equals(subscriber.id.clone()),
                    vec![],
                )
                .exec()
                .await?;

            let mut confirmation_url =
                format!("{}/confirm/{}", settings.value, confirmation_setting.id);

            let mut subscribe = HashMap::new();
            subscribe.insert("url".to_string(), confirmation_url);

            hashmap.insert("subscribe".to_string(), subscribe);
        } else {
            anyhow::bail!("Settings not found");
        }

        let mut template = HashMap::new();
        template.insert(
            "unsubscribe".to_string(),
            "You are subscribed. Click".to_string(),
        );
        template.insert("unsubscribe_url".to_string(), "here".to_string());

        hashmap.insert("template".to_string(), template);

        Ok(hashmap)
    }

    /// Convert "Data" (struct) into a Hashmap<String, String>
    /// This is used to convert the "subscriber" and "list" structs into a hashmap
    /// which is then used to build the variables for the email
    pub fn convert_to_hashmap<T: serde::Serialize>(
        &self,
        data: &T,
    ) -> anyhow::Result<HashMap<String, String>> {
        let data = serde_json::to_value(data)?;
        let data = data.as_object().unwrap();

        // only allow values that are strings
        let mut hashmap = HashMap::new();
        for (key, value) in data {
            if let Some(value) = value.as_str() {
                hashmap.insert(key.to_string(), value.to_string());
            }
        }

        Ok(hashmap)
    }
}
