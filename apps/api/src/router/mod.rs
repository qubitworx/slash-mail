pub mod auth;
pub mod smtp;
pub mod user;

use rspc::{Config, Router};
use std::{path::PathBuf, sync::Arc};

use crate::{config::Config as AppConfig, mailer::pool::MailerPool};

#[derive(Clone)]
pub struct Context {
    pub client: Arc<crate::prisma::PrismaClient>,

    pub config: AppConfig,

    pub cookies: tower_cookies::Cookies,

    pub pool: MailerPool,
}

pub fn init_router() -> Router<Context> {
    let router = Router::new()
        .config(
            Config::new()
                // Doing this will automatically export the bindings when the `build` function is called.
                .export_ts_bindings(
                    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../frontend/rspc/bindings.ts"),
                ),
        )
        .query("version", |t| {
            t(|_, _: ()| async move { Ok("0.1.0".to_string()) })
        })
        .merge("auth.", auth::router())
        .middleware(|mw| {
            mw.middleware(|mw| async move {
                let cookie = mw.ctx.cookies.get("sk");

                if cookie.is_none() {
                    return Err(rspc::Error::new(
                        rspc::ErrorCode::Forbidden,
                        "You must be logged in to access this resource".to_owned(),
                    ));
                }

                let sk = cookie.unwrap().value().to_owned();

                let secret_key = mw
                    .ctx
                    .client
                    .secret_keys()
                    .find_unique(crate::prisma::secret_keys::id::equals(sk))
                    .exec()
                    .await?;

                if secret_key.is_none() {
                    return Err(rspc::Error::new(
                        rspc::ErrorCode::Forbidden,
                        "You must be logged in to access this resource".to_owned(),
                    ));
                }

                let sk = secret_key.unwrap();

                if sk.expires_at.is_some() {
                    let expires_at = sk.expires_at.unwrap();

                    // If the secret key has expired, we should delete it and return an error.
                    if expires_at < chrono::Utc::now() {
                        mw.ctx
                            .client
                            .secret_keys()
                            .delete(crate::prisma::secret_keys::id::equals(sk.id))
                            .exec()
                            .await?;

                        return Err(rspc::Error::new(
                            rspc::ErrorCode::Forbidden,
                            "You must be logged in to access this resource".to_owned(),
                        ));
                    }
                }
                Ok(mw)
            })
        })
        .merge("user.", user::router())
        .merge("smtp.", smtp::router())
        .build();

    router
}
