use rspc::{Router, RouterBuilder};

use super::Context;

pub fn router() -> RouterBuilder<Context> {
    let router = Router::new().query("authenticated", |t| {
        // This route is protected by the middleware in apps/api/src/router/mod.rs.
        // We don't have any specific user data to return, so we just return true.
        t(|_, _: ()| Ok(true))
    });
    router
}
