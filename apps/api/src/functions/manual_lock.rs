use std::sync::{Condvar, Mutex};

/// A manual lock that can be used to lock and unlock data.
///
/// For example This is useful for locking a mailer instance while it is being used.
pub struct ManualLock<T> {
    pub lock: Mutex<bool>,
    pub condvar: Condvar,
    pub data: T,
}

impl<T> ManualLock<T> {
    pub fn new(data: T) -> Self {
        ManualLock {
            lock: Mutex::new(false),
            condvar: Condvar::new(),
            data,
        }
    }

    /// Locks the data
    pub fn lock(&self) {
        let mut locked = self.lock.lock().unwrap();
        while *locked {
            locked = self.condvar.wait(locked).unwrap();
        }
        *locked = true;
    }

    /// Unlocks the data
    pub fn unlock(&self) {
        let mut locked = self.lock.lock().unwrap();
        *locked = false;
        self.condvar.notify_all();
    }
}
