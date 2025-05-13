use dioxus::prelude::*;

use bifrost_api::config::{AppConfig, BifrostConfig};
use bifrost_api::error::BifrostError;

use crate::component::markup::{Filename, Section};

#[component]
pub fn Config() -> Element {
    let config = use_context::<Signal<Result<AppConfig, BifrostError>>>();

    rsx! {
        Section { "Config" }
        div {
            class: "w-full",
            class: "badge badge-soft",
            "Foo"
        }
        match &*config.read() {
            Ok(cfg) => {
                rsx! {
                    Section { "Bridge" }
                    pre {
                        "{cfg.bridge:#?}"
                    }

                    Section { "Bifrost" }
                    BifrostConfigView { cfg: cfg.bifrost.clone() }
                }
            }

            Err(_err) => rsx! {
                div {
                    class: "skeleton",
                    class: "w-64",
                    class: "h-32",
                }
            },
        }
    }
}

#[component]
fn BifrostConfigView(cfg: BifrostConfig) -> Element {
    rsx! {
        p { "state_file: " Filename { "{cfg.state_file}" } }
        p { "cert_file: " Filename { "{cfg.cert_file}" } }
    }
}
