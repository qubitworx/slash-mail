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
use log::info;
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
    let mut pool = mailer::pool::MailerPool::new(client.clone()).await.unwrap();

    pool.add_mailer().await.unwrap();
    pool.add_mailer().await.unwrap();

    let mailer = pool.get_mailer().await.unwrap();
    pool.release_mailer(mailer).await.unwrap();
    let amailer = pool.get_mailer().await.unwrap();
    pool.release_mailer(amailer).await.unwrap();

    let mut pool_clone = pool.clone();

    for p in pool.pools.values() {
        println!("{}: {:?}", p.data.identifier, p.lock);
    }

    // create a new thread to run the mailer pool in
    let t = tokio::spawn(async move {
        info!("Waiting for mailer to be released...");
        pool_clone.get_mailer().await.unwrap();
    });

    t.await;

    for p in pool.pools.values() {
        println!("{}: {:?}", p.data.identifier, p.lock);
    }

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
