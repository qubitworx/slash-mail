use std::{collections::HashMap, sync::Arc};

use crate::prisma;

pub async fn build_mail(
    source: String,
    variables: HashMap<String, HashMap<String, String>>,
) -> anyhow::Result<String> {
    let pattern = r"\{\{([^{}]+)\}\}";
    let re = regex::Regex::new(pattern).unwrap();
    let mut matches = re.captures_iter(&source);

    let mut new_source = source.clone();

    for mat in matches {
        let key = mat.get(1).unwrap().as_str();

        // key is in the format of variable_name.property_name
        let mut key_parts = key.to_string();
        let mut key_parts = key_parts.split(".");

        let variable_name = key_parts.next().unwrap();
        let property_name = key_parts.next().unwrap();

        if let Some(variable) = variables.get(variable_name) {
            if let Some(property) = variable.get(property_name) {
                let value = property.clone();

                new_source = new_source.replace(&format!("{{{{{}}}}}", key), &value);
            } else {
                log::warn!("Property {} not found", property_name);

                anyhow::bail!("Property {} not found", property_name);
            }
        } else {
            log::warn!("Variable {} not found", variable_name);

            anyhow::bail!("Variable {} not found", variable_name);
        }
    }

    Ok(new_source)
}

pub async fn build_template(
    client: Arc<prisma::PrismaClient>,
    template_key: String,
) -> anyhow::Result<String> {
    // Load the default template
    let template = client
        .template()
        .find_unique(prisma::template::UniqueWhereParam::IdentifierEquals(
            "default".to_string(),
        ))
        .exec()
        .await?
        .unwrap();

    let source = template.content;

    // Load the template for the given key
    let template = client
        .template()
        .find_unique(prisma::template::UniqueWhereParam::IdentifierEquals(
            template_key,
        ))
        .exec()
        .await?
        .unwrap();

    // If the template is set to ignore the default template, return the template content
    // without the default template
    if template.ignore_default_template {
        return Ok(template.content);
    }

    let source = source.replace("{{ content }}", &template.content);

    Ok(source)
}
