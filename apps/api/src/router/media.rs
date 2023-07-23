use rspc::RouterBuilder;

use crate::prisma;

use super::Context;

pub fn router() -> RouterBuilder<Context> {
    let router = RouterBuilder::<Context>::new()
        .query("get_all", |t| {
            t(|ctx, _: ()| async move {
                let media = ctx
                    .client
                    .media()
                    .find_many(vec![])
                    .select(crate::prisma::media::select!({
                        id
                        filename
                    }))
                    .exec()
                    .await?;

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
                let m = ctx
                    .client
                    .media()
                    .find_unique(crate::prisma::media::filename::equals(
                        input.filename.clone(),
                    ))
                    .exec()
                    .await
                    .unwrap_or(None);

                if m.is_some() {
                    return Err(rspc::Error::new(
                        rspc::ErrorCode::Conflict,
                        "A file with that name already exists".to_owned(),
                    ));
                }

                let media = ctx
                    .client
                    .media()
                    .create(input.filename, input.content, vec![])
                    .exec()
                    .await
                    .unwrap();

                Ok(media)
            })
        })
        .mutation("delete", |t| {
            t(|ctx, input: String| async move {
                ctx.client
                    .media()
                    .delete(prisma::media::id::equals(input))
                    .exec()
                    .await?;

                Ok(())
            })
        });

    router
}
