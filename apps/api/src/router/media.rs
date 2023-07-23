use rspc::RouterBuilder;

use super::Context;

pub fn router() -> RouterBuilder<Context> {
    let router = RouterBuilder::<Context>::new()
        .query("get_all", |t| {
            t(|ctx, _: ()| async move {
                let media = ctx.client.media().find_many(vec![]).exec().await?;

                Ok(media)
            })
        })
        .mutation("upload", |t| {
            #[derive(rspc::Type, serde::Deserialize)]
            pub struct UploadInput {
                pub content: Vec<u8>,
                filename: String,
            }

            t(|ctx, input: UploadInput| async move {
                let media = ctx
                    .client
                    .media()
                    .create(input.filename, input.content, vec![])
                    .exec()
                    .await?;

                Ok(media)
            })
        });

    router
}
