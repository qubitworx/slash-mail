use axum::{
    extract::{Path, State},
    http::StatusCode,
};

use crate::prisma;
use crate::router::Context;

pub async fn get(
    Path(path): Path<String>,
    State(ctx): State<Context>,
) -> Result<Vec<u8>, StatusCode> {
    let prisma = ctx.client.clone();

    let result = prisma
        .media()
        .find_unique(prisma::media::filename::equals(path))
        .exec()
        .await
        .unwrap_or(None);

    if result.is_none() {
        return Err(StatusCode::NOT_FOUND);
    }

    let result = result.unwrap();

    let content = result.content; // base64

    Ok(content)
}
