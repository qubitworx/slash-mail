use rspc::RouterBuilder;

use crate::prisma;

use super::Context;

pub fn router() -> RouterBuilder<Context> {
    RouterBuilder::<Context>::new()
        .query("get_all", |t| {
            t(|ctx, _: ()| async move {
                let templates = ctx.client.template().find_many(vec![]).exec().await?;

                Ok(templates)
            })
        })
        .mutation("delete", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct TemplateDeleteInput {
                pub ids: Vec<String>,
            }

            t(|ctx, input: TemplateDeleteInput| async move {
                let templates = ctx
                    .client
                    .template()
                    .delete_many(
                        input
                            .ids
                            .iter()
                            .map(|id| prisma::template::id::equals(id.to_string()))
                            .collect(),
                    )
                    .exec()
                    .await?;

                Ok("Successfully deleted templates.")
            })
        })
        .query("get", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct TemplateGetInput {
                pub id: String,
            }

            t(|ctx, input: TemplateGetInput| async move {
                let template = ctx
                    .client
                    .template()
                    .find_unique(prisma::template::id::equals(input.id))
                    .exec()
                    .await?;

                Ok(template)
            })
        })
        .mutation("edit", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct TemplateEditInput {
                pub id: String,
                pub html: String,
                pub json: String,
                pub identifier: String,
                pub name: String,
            }

            t(|ctx, input: TemplateEditInput| async move {
                let template = ctx
                    .client
                    .template()
                    .update(
                        prisma::template::id::equals(input.id),
                        vec![
                            prisma::template::content::set(input.html),
                            prisma::template::json::set(input.json),
                            prisma::template::identifier::set(input.identifier),
                            prisma::template::name::set(input.name),
                        ],
                    )
                    .exec()
                    .await?;

                Ok(template)
            })
        })
        .mutation("create", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct TemplateCreateInput {
                pub name: String,
                pub identifier: String,
                pub html: String,
                pub json: String,
            }

            t(|ctx, input: TemplateCreateInput| async move {
                let template = ctx
                    .client
                    .template()
                    .create(input.name, input.identifier, input.html, input.json, vec![])
                    .exec()
                    .await?;

                Ok(template)
            })
        })
}
