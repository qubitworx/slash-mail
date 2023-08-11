use std::sync::{Condvar, Mutex};

/// A manual lock that can be used to lock and unlock data.
///
/// For example This is useful for locking a mailer instance while it is being used.
pub struct ManualLock<T> {
    pub data: T,
    pub number_of_locks: usize,
}

impl<T> ManualLock<T> {
    pub fn new(data: T) -> Self {
        ManualLock {
            data,
            number_of_locks: 0,
        }
    }

    /// Locks the data
    pub fn lock(&mut self) -> anyhow::Result<()> {
        if (self.number_of_locks > 10) {
            return Err(anyhow::anyhow!("Too many locks"));
        }

        self.number_of_locks += 1;

        Ok(())
    }

    /// Unlocks the data
    pub fn unlock(&mut self) {
        self.number_of_locks -= 1;
    }
}
