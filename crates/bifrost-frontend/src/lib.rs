#![allow(non_snake_case)]
#![allow(unused_qualifications)]

pub mod icons;
pub mod toast;
pub mod traits;

use dioxus::prelude::*;

#[must_use]
pub fn base_url() -> String {
    web_sys::window().unwrap().location().origin().unwrap()
}

pub fn use_context_signal_provider<T: 'static>(f: impl FnOnce() -> T) -> Signal<T, UnsyncStorage> {
    let inner = use_signal(f);
    use_context_provider(move || inner)
}

#[must_use]
pub fn use_context_signal<T>() -> Signal<T> {
    use_context::<Signal<T>>()
}
