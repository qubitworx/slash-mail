use rspc::RouterBuilder;

use crate::prisma;

use super::Context;

pub fn router() -> RouterBuilder<Context> {
    RouterBuilder::<Context>::new()
        .mutation("create", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct ListCreateInput {
                pub name: String,
                pub description: String,
                pub requires_confirmation: bool,
            }
            t(|ctx, input: ListCreateInput| async move {
                let prisma = ctx.client.clone();

                prisma
                    .list()
                    .create(
                        input.name,
                        input.description,
                        vec![prisma::list::requires_confirmation::set(
                            input.requires_confirmation,
                        )],
                    )
                    .exec()
                    .await?;

                Ok(())
            })
        })
        .query("get_all", |t| {
            t(|ctx, _: ()| async move {
                let prisma = ctx.client.clone();

                let lists = prisma
                    .list()
                    .find_many(vec![])
                    .order_by(prisma::list::created_at::order(
                        prisma_client_rust::Direction::Desc,
                    ))
                    .select(prisma::list::select!({
                        id
                        name
                        description
                        requires_confirmation
                        created_at
                        updated_at
                    }))
                    .exec()
                    .await?;

                Ok(lists)
            })
        })
        .query("get", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct ListGetInput {
                pub id: String,
            }
            t(|ctx, input: ListGetInput| async move {
                let prisma = ctx.client.clone();

                let list = prisma
                    .list()
                    .find_first(vec![prisma::list::id::equals(input.id)])
                    .exec()
                    .await?;

                Ok(list)
            })
        })
        .mutation("delete", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct ListDeleteInput {
                pub id: String,
            }
            t(|ctx, input: ListDeleteInput| async move {
                let prisma = ctx.client.clone();

                prisma
                    .list()
                    .delete(prisma::list::id::equals(input.id))
                    .exec()
                    .await?;

                Ok(())
            })
        })
}
