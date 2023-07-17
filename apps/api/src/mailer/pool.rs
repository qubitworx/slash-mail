use std::{collections::HashMap, sync::Arc};

use rand::seq::IteratorRandom;

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

        pools.insert(mailer.identifier.clone(), Arc::new(ManualLock::new(mailer)));

        self.pools = pools.clone();

        Ok(())
    }

    /// Get a mailer from the pool.
    /// If no mailer is available, wait for a mailer to be available.
    /// NOTE: This is a blocking call.
    /// TODO: Add a timeout to this.
    pub async fn get_mailer(&self) -> anyhow::Result<Mailer> {
        let pools = &self.pools;

        let mut data = None;

        for (_, mailer) in pools.iter() {
            // Check if the mailer is locked or not.
            if mailer.lock.lock().unwrap().clone() {
                continue;
            }

            // lock the mailer
            mailer.lock();

            data = Some(mailer.data.clone());
        }

        if data.is_none() {
            return Err(anyhow::anyhow!("No mailers available"));
        }

        Ok(data.unwrap())
    }

    /// Release a mailer back into the pool.
    pub async fn release_mailer(&mut self, mailer: Mailer) -> anyhow::Result<()> {
        let pools = &mut self.pools;

        let mailer: &Arc<ManualLock<Mailer>> = pools.get(&mailer.identifier).unwrap();

        mailer.unlock();

        Ok(())
    }
}
