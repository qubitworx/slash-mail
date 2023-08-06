use log::info;
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
        .query("available_subscribers", |t| {
            t(|ctx, id: String| async move {
                let prisma = ctx.client.clone();

                let subscribed_lists = prisma
                    .list_subscriber()
                    .find_many(vec![prisma::list_subscriber::list_id::equals(id)])
                    .select(prisma::list_subscriber::select!({ subscriber_id }))
                    .exec()
                    .await?;

                info!("subscribed_lists: {:?}", subscribed_lists);

                let subs = prisma
                    .subscriber()
                    .find_many(vec![
                        prisma::subscriber::id::not_in_vec(
                            subscribed_lists
                                .iter()
                                .map(|ls| ls.subscriber_id.clone())
                                .collect::<Vec<String>>(),
                        ),
                        prisma::subscriber::status::equals("enabled".to_string()),
                    ])
                    .exec()
                    .await?;

                Ok(subs)
            })
        })
        .query("get_subscribers", |t| {
            t(|ctx, id: String| async move {
                let prisma = ctx.client.clone();

                let subs = prisma
                    .list_subscriber()
                    .find_many(vec![prisma::list_subscriber::list_id::equals(id)])
                    .select(prisma::list_subscriber::select!({
                        id
                        status
                        created_at
                        updated_at
                        subscriber: select {
                            id
                            email
                            name
                        }
                    }))
                    .exec()
                    .await?;

                Ok(subs)
            })
        })
        .mutation("add_subscribers", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct ListAddSubscribersInput {
                pub list_id: String,
                pub subscriber_ids: Vec<String>,
            }

            t(|ctx, input: ListAddSubscribersInput| async move {
                let prisma = ctx.client.clone();

                let list = prisma
                    .list()
                    .find_unique(prisma::list::id::equals(input.list_id.clone()))
                    .exec()
                    .await?
                    .unwrap();

                let status = if list.requires_confirmation {
                    "unconfirmed".to_string()
                } else {
                    "confirmed".to_string()
                };

                for sub_id in input.subscriber_ids {
                    prisma
                        .list_subscriber()
                        .create(
                            status.clone(),
                            prisma::list::id::equals(input.list_id.clone()),
                            prisma::subscriber::id::equals(sub_id),
                            vec![],
                        )
                        .exec()
                        .await?;
                }

                Ok("")
            })
        })
        .mutation("unsubscribe_subscribers", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct ListUnsubscribeSubscribersInput {
                pub subscriber_ids: Vec<String>,
            }

            t(|ctx, input: ListUnsubscribeSubscribersInput| async move {
                let prisma = ctx.client.clone();

                for sub_id in input.subscriber_ids {
                    prisma
                        .list_subscriber()
                        .delete(prisma::list_subscriber::id::equals(sub_id.clone()))
                        .exec()
                        .await?;
                }

                Ok("")
            })
        })
}
