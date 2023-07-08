#[derive(Clone, Debug)]
pub struct Config {
    pub username: String,
    pub password: String,
}

impl Config {
    pub fn new() -> Self {
        let username = std::env::var("USERNAME");
        let password = std::env::var("PASSWORD");

        if username.is_err() || password.is_err() {
            log::error!("Missing USERNAME or PASSWORD environment variable");
        }

        Self {
            username: username.as_ref().unwrap().to_string(),
            password: password.as_ref().unwrap().to_string(),
        }
    }
}
