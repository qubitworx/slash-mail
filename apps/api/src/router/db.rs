use rspc::RouterBuilder;

use super::Context;

pub fn router() -> RouterBuilder<Context> {
    RouterBuilder::<Context>::new().mutation("vacuum", |t| {
        t(|ctx, _: ()| async move {
            let result = ctx
                .client
                ._execute_raw(prisma_client_rust::raw!("vacuum;"))
                .exec()
                .await?;

            Ok(result)
        })
    })
}
