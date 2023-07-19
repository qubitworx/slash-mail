pub mod config;
pub mod crypto;
pub mod functions;
pub mod mailer;
pub mod prisma;
pub mod router;

use std::sync::Arc;

use axum::{
    http::{
        header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE},
        HeaderValue,
    },
    routing::get,
    Router,
};
use rspc::integrations::httpz::Request;
use tower_cookies::{CookieManagerLayer, Cookies};

// basic handler that responds with a static string
async fn root() -> &'static str {
    "Hello, World!"
}

#[tokio::main]
async fn main() {
    #[cfg(debug_assertions)]
    {
        std::env::set_var("RUST_LOG", "info");
    }
    dotenv::dotenv().unwrap();

    tracing_subscriber::fmt::init();

    let config = crate::config::Config::new();

    let client = Arc::new(prisma::new_client().await.unwrap());
    let pool = mailer::pool::MailerPool::new(client.clone()).await.unwrap();

    let router = router::init_router().arced();

    let cors = tower_http::cors::CorsLayer::new()
        .allow_origin(
            std::env::var("FRONTEND_URL")
                .unwrap()
                .parse::<HeaderValue>()
                .unwrap(),
        )
        .allow_headers([AUTHORIZATION, CONTENT_TYPE, ACCEPT])
        .allow_credentials(true);

    let app = Router::new()
        .route("/", get(root))
        .nest(
            "/rspc",
            router
                .endpoint(move|mut req: Request| {
                    let cookies = req
                        .deprecated_extract::<Cookies, ()>()
                        .expect("The Axum state doesn't match the router. Ensure you added `with_state(T)` where `T` matches the second generic!")
                        .unwrap();

                    router::Context {
                    client: client.clone(),
                    config: config.clone(),
                    cookies,
                    pool: pool.clone(),
                    }}
                )
                .axum(),
        )
        .layer(CookieManagerLayer::new())
        .layer(cors);

    let listener = std::net::TcpListener::bind("0.0.0.0:8000").unwrap();

    log::info!("Listening on http://{}", listener.local_addr().unwrap());

    axum::Server::from_tcp(listener)
        .unwrap()
        .serve(app.into_make_service())
        .await
        .unwrap();
}
