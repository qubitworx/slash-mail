use log::info;
use rspc::RouterBuilder;

use crate::{
    functions::mail_builder::{self, build_template},
    prisma,
};

use super::Context;

pub fn router() -> RouterBuilder<Context> {
    RouterBuilder::<Context>::new()
        // Creates a new list, requires a name, description, requires_confirmation and default_smtp_settings_id
        .mutation("create", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct ListCreateInput {
                pub name: String,
                pub description: String,
                pub requires_confirmation: bool,
                pub default_smtp_settings_id: Option<String>,
            }

            t(|ctx, input: ListCreateInput| async move {
                let prisma = ctx.client.clone();

                prisma
                    .list()
                    .create(
                        input.name,
                        input.description,
                        vec![
                            prisma::list::requires_confirmation::set(input.requires_confirmation),
                            prisma::list::s_mtp_settings_id::set(input.default_smtp_settings_id),
                        ],
                    )
                    .exec()
                    .await?;

                Ok(())
            })
        })
        // Get all lists with the default smtp settings included
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
                        default_smtp_settings: select {
                            id
                            smtp_host
                            smtp_user
                        }
                    }))
                    .exec()
                    .await?;

                Ok(lists)
            })
        })
        // Get a list by id with the default smtp settings included
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
                    .select(prisma::list::select!({
                        id
                        name
                        description
                        requires_confirmation
                        created_at
                        updated_at
                        default_smtp_settings: select {
                            id
                            smtp_host
                            smtp_user
                        }
                    }))
                    .exec()
                    .await
                    .unwrap();

                Ok(list)
            })
        })
        // Delete a list by id
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
        // Get all the subscribers who are not subscribed to the list.
        .query("available_subscribers", |t| {
            t(|ctx, id: String| async move {
                let prisma = ctx.client.clone();

                let subscribed_lists = prisma
                    .list_subscriber()
                    .find_many(vec![prisma::list_subscriber::list_id::equals(id)])
                    .select(prisma::list_subscriber::select!({ subscriber_id }))
                    .exec()
                    .await?;

                info!("Subscribed lists: {:?}", subscribed_lists);

                // Get all the subscribers who are not subscribed to the list.
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
                    .await
                    .unwrap();

                Ok(subs)
            })
        })
        .mutation("add_subscribers", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct ListAddSubscribersInput {
                pub list_id: String,
                pub subscriber_ids: Vec<String>,
            }

            t(|mut ctx, input: ListAddSubscribersInput| async move {
                let prisma = ctx.client.clone();

                let list = prisma
                    .list()
                    .find_unique(prisma::list::id::equals(input.list_id.clone()))
                    .exec()
                    .await?
                    .unwrap();

                let mut tasks = vec![];
                let list_with_default_smtp_settings = prisma
                    .list()
                    .find_unique(prisma::list::id::equals(input.list_id.clone()))
                    .select(prisma::list::select!({
                        default_smtp_settings: select {
                            id
                            smtp_host
                            smtp_user
                            smtp_from
                        }
                    }))
                    .exec()
                    .await?
                    .unwrap();

                let status = if list.requires_confirmation {
                    "unconfirmed".to_string()
                } else {
                    "confirmed".to_string()
                };

                let email_verify_template =
                    build_template(prisma.clone(), "email-verify".to_string())
                        .await
                        .map_err(|e| {
                            log::error!("Error building template: {:?}", e);
                            rspc::Error::new(rspc::ErrorCode::Conflict, e.to_string())
                        })?;

                for sub_id in input.subscriber_ids {
                    // Get the subscriber
                    let subscriber = prisma
                        .subscriber()
                        .find_unique(prisma::subscriber::id::equals(sub_id.clone()))
                        .exec()
                        .await?
                        .unwrap();

                    // We first create the list subscriber
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

                    if list.requires_confirmation {
                        // Create the variables for the mail template
                        let mut hashmap = ctx
                            .mail_variables
                            .build_variables(&subscriber, &list)
                            .await
                            .map_err(|e| {
                                log::error!("Error building mail variables: {:?}", e);
                                rspc::Error::new(rspc::ErrorCode::Conflict, e.to_string())
                            })?;

                        let build_mail =
                            mail_builder::build_mail(email_verify_template.clone(), hashmap)
                                .await
                                .map_err(|e| {
                                    log::error!("Error building mail: {:?}", e);
                                    rspc::Error::new(rspc::ErrorCode::Conflict, e.to_string())
                                })?;

                        let list = list_with_default_smtp_settings.clone();
                        let mut pool = ctx.pool.clone();
                        let task = tokio::spawn(async move {
                            info!("Acquiring mailer for {}", subscriber.email);
                            let start_time = std::time::Instant::now();
                            let mail = pool.get_mailer().await.unwrap();

                            info!(
                                "Acquired mailer for {} in {:?}",
                                subscriber.email,
                                start_time.elapsed()
                            );

                            mail.send_mail(
                                list.default_smtp_settings
                                    .as_ref()
                                    .unwrap()
                                    .smtp_user
                                    .clone(),
                                subscriber.email,
                                "Confirm your subscription".to_string(),
                                build_mail,
                            )
                            .unwrap();
                        });

                        tasks.push(task);
                    }
                }

                futures::future::join_all(tasks).await;

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
                        .await;
                }

                Ok("")
            })
        })
        .mutation("edit", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct ListEditInput {
                pub id: String,
                pub name: String,
                pub description: String,
                pub requires_confirmation: bool,
                pub default_smtp_settings_id: Option<String>,
            }
            t(|ctx, input: ListEditInput| async move {
                let prisma = ctx.client.clone();

                prisma
                    .list()
                    .update(
                        prisma::list::id::equals(input.id),
                        vec![
                            prisma::list::name::set(input.name),
                            prisma::list::description::set(input.description),
                            prisma::list::requires_confirmation::set(input.requires_confirmation),
                            prisma::list::s_mtp_settings_id::set(input.default_smtp_settings_id),
                        ],
                    )
                    .exec()
                    .await?;

                Ok(())
            })
        })
}
