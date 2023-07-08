pub mod auth;
pub mod user;

use rspc::{Config, Router};
use std::{path::PathBuf, sync::Arc};

use crate::config::Config as AppConfig;

#[derive(Clone)]
pub struct Context {
    pub client: Arc<prisma::PrismaClient>,

    pub config: AppConfig,

    pub cookies: tower_cookies::Cookies,
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
                    .find_unique(prisma::secret_keys::id::equals(sk))
                    .exec()
                    .await?;

                if secret_key.is_none() {
                    return Err(rspc::Error::new(
                        rspc::ErrorCode::Forbidden,
                        "You must be logged in to access this resource".to_owned(),
                    ));
                }

                Ok(mw)
            })
        })
        .merge("user.", user::router())
        .build();

    router
}
