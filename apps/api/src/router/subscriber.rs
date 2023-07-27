use rspc::RouterBuilder;

use super::Context;

pub fn router() -> RouterBuilder<Context> {
    let router = RouterBuilder::<Context>::new()
        .mutation("create", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct SubscriberCreateInput {
                pub email: String,
                pub name: String,
                pub attributes: String,
                pub status: String,
            }
            t(|ctx, input: SubscriberCreateInput| async move {
                let prisma = ctx.client.clone();

                let sub = prisma
                    .subscriber()
                    .create(
                        input.email,
                        input.name,
                        input.status,
                        input.attributes,
                        vec![],
                    )
                    .exec()
                    .await?;

                Ok(sub)
            })
        })
        .query("get_all", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct SubscriberGetInput {
                pub skip: i32,
                pub take: i32,
                pub name: Option<String>,
            }

            t(|ctx, input: SubscriberGetInput| async move {
                let prisma = ctx.client.clone();

                let mut where_clause: Vec<crate::prisma::subscriber::WhereParam> = vec![];

                if let Some(name) = input.name {
                    where_clause.push(crate::prisma::subscriber::name::contains(name));
                }

                let subs = prisma
                    .subscriber()
                    .find_many(where_clause)
                    .skip(input.skip.try_into().unwrap())
                    .take(input.take.try_into().unwrap())
                    .exec()
                    .await?;

                Ok(subs)
            })
        });

    router
}
