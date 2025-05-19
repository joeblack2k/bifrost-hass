use std::collections::BTreeMap;

use dioxus::prelude::*;
use uuid::Uuid;

use hue::api::{GroupedLight, Resource, ResourceRecord};

use crate::component::group::{GroupOnIcon, GroupView};
use crate::daisyui::Level;
use crate::daisyui::badge::Badge;
use crate::icons::RoomIcon;
use crate::use_context_signal;

#[component]
pub fn GroupsView() -> Element {
    let rres = use_context_signal::<BTreeMap<Uuid, ResourceRecord>>();
    let res = &*rres.read();

    rsx! {
        div {
            class: "grid gap-4",
            class: "max-w-200",
            for (uuid, item) in res {

                if let Resource::Room(room) = &item.obj {
                    div {
                        key: "{uuid}",
                        div {
                            class: "bg-base-200 w-full p-5 border-b-2 border-primary/40 rounded-t-xl",
                            div {
                                class: "flex flex-col lg:flex-row *:text-nowrap",
                                RoomIcon { archetype: room.metadata.archetype }

                                if let Some(gl) = room.grouped_light_service() {
                                    if let Some(ResourceRecord {
                                        obj: Resource::GroupedLight(GroupedLight { on: Some(on), ..}),
                                        ..
                                    }) = res.get(&gl.rid) {
                                        GroupOnIcon { id: gl.rid, on: *on }
                                    }
                                }

                                div {
                                    class: "grow",
                                    Badge {
                                        level: Level::Info,
                                        soft: true,
                                        class: "font-mono",
                                        "{room.metadata.name}"
                                    }
                                }

                                Badge {
                                    level: Level::Info,
                                    soft: true,
                                    class: "font-mono",
                                    { item.id_v1.as_deref().unwrap_or("-") }
                                }
                                "|",
                                Badge {
                                    level: Level::Info,
                                    soft: true,
                                    class: "font-mono",
                                    "{uuid}"
                                }
                            }
                        }
                        div {
                            class: "bg-base-300 p-5 rounded-b-xl",
                            GroupView { res: rres, id: *uuid, room: room.clone() }
                        }
                    }
                }
            }
        }
    }
}
