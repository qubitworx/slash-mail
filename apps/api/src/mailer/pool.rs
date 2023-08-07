use std::{collections::HashMap, sync::Arc};

use chrono::Duration;
use log::info;

use crate::{functions::manual_lock::ManualLock, prisma::PrismaClient};

use super::Mailer;

pub type MailerPoolType = HashMap<String, Arc<ManualLock<Mailer>>>;

#[derive(Clone)]
pub struct MailerPool {
    pub client: Arc<PrismaClient>,
    pub pools: MailerPoolType,
}

impl MailerPool {
    pub async fn new(client: Arc<PrismaClient>) -> anyhow::Result<Self> {
        let pools = HashMap::new();

        Ok(Self { client, pools })
    }

    pub async fn add_mailer(&mut self) -> anyhow::Result<()> {
        let mailer = Mailer::new(self.client.clone()).await?;

        let pools = &mut self.pools.clone();
        let m = Arc::new(ManualLock::new(mailer.clone()));

        pools.insert(mailer.identifier.clone(), m);

        self.pools = pools.clone();

        Ok(())
    }

    /// Get a mailer from the pool.
    /// If no mailer is available, wait for a mailer to be available.
    /// NOTE: This is a blocking call.
    /// TODO: Add a timeout to this.
    pub fn get_mailer(&self) -> anyhow::Result<Mailer> {
        let pools = &self.pools;

        for (_, mailer) in pools.iter() {
            let locked = mailer.lock.lock().unwrap();
            if locked.clone() {
                info!("Mailer is locked, {}", mailer.data.identifier);
                continue;
            }

            // Lock the mailer
            drop(locked);

            if let Ok(mailer_lock) = mailer.lock.lock() {
                // Return the mailer if successful
                return Ok(mailer.data.clone());
            }
        }

        // Return an error if no mailer is available within the timeout
        Err(anyhow::anyhow!("No mailers available"))
    }
    /// Release a mailer back into the pool.
    pub fn release_mailer(&mut self, mailer: Mailer) -> anyhow::Result<()> {
        let pools = &mut self.pools;

        let mailer: &Arc<ManualLock<Mailer>> = pools.get(&mailer.identifier).unwrap();

        mailer.unlock();

        Ok(())
    }
}
