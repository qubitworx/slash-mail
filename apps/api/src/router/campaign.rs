use rspc::RouterBuilder;

use super::Context;

pub fn router() -> RouterBuilder<Context> {
    let router = RouterBuilder::<Context>::new().query("get_all", |t| {
        t(|ctx, _: ()| async move {
            let db = ctx.client.clone();

            let campaigns = db.campaign().find_many(vec![]).exec().await?;

            Ok(campaigns)
        })
    });

    router
}
