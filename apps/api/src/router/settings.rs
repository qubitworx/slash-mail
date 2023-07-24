use rspc::RouterBuilder;

use super::Context;

pub fn router() -> RouterBuilder<Context> {
    RouterBuilder::<Context>::new().query("get_all", |t| {
        t(|ctx, _: ()| async move {
            let settings = ctx.client.settings().find_many(vec![]).exec().await?;

            Ok(settings)
        })
    })
}
