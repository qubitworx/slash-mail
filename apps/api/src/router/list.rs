use std::collections::HashMap;

use log::info;
use rspc::RouterBuilder;

use crate::{functions::mail_builder, prisma};

use super::Context;

const EMAIL_VERIFY_TEMPLATE: &str = include_str!("../templates/email_verify.html");

pub fn router() -> RouterBuilder<Context> {
    RouterBuilder::<Context>::new()
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

            t(|mut ctx, input: ListAddSubscribersInput| async move {
                let prisma = ctx.client.clone();

                let list = prisma
                    .list()
                    .find_unique(prisma::list::id::equals(input.list_id.clone()))
                    .include(prisma::list::include!({
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

                    // Create the variables for the mail template
                    let mut hashmap = HashMap::new();

                    let mut lists = HashMap::new();
                    lists.insert("name".to_string(), list.name.clone());
                    lists.insert("description".to_string(), list.description.clone());

                    // convert subscriber to hashmap
                    let mut subscriber_values = HashMap::new();
                    subscriber_values.insert("name".to_string(), subscriber.name.clone());
                    subscriber_values.insert("email".to_string(), subscriber.email.clone());

                    let mut subscribe_values = HashMap::new();
                    subscribe_values.insert("url".to_string(), "https://google.com".to_string());

                    hashmap.insert("list".to_string(), lists);
                    hashmap.insert("subscriber".to_string(), subscriber_values);
                    hashmap.insert("subscribe".to_string(), subscribe_values);

                    //
                    let build_mail =
                        mail_builder::build_mail(EMAIL_VERIFY_TEMPLATE.to_string(), hashmap)
                            .await
                            .map_err(|e| {
                                log::error!("Error building mail: {:?}", e);
                                rspc::Error::new(rspc::ErrorCode::Conflict, e.to_string())
                            })?;

                    let mail = ctx.pool.get_mailer().unwrap();

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

                    ctx.pool.release_mailer(mail).unwrap();
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
