# -----------------------------------------------------------------------------
# Building stage
# -----------------------------------------------------------------------------
ARG RUST_VERSION=1.85
FROM rust:${RUST_VERSION}-slim-bookworm AS build
WORKDIR /app
COPY LICENSE LICENSE

ENV PATH="/.cargo/bin:$PATH"

# Install packages
RUN apt-get -y update && apt-get install -y --no-install-recommends pkg-config libssl-dev curl

# Install "dx" (Dioxus tooling)
RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash
RUN cargo binstall dioxus-cli --root "/.cargo" -y --force

# Add wasm target (for compiling frontend)
RUN rustup target add wasm32-unknown-unknown

# Compile Bifrost
RUN --mount=type=bind,source=doc,target=doc \
    --mount=type=bind,source=src,target=src \
    --mount=type=bind,source=crates,target=crates \
    --mount=type=bind,source=Cargo.toml,target=Cargo.toml \
    --mount=type=bind,source=Cargo.lock,target=Cargo.lock \
    cargo build --locked --release

# Compile frontend
RUN --mount=type=bind,source=doc,target=doc \
    --mount=type=bind,source=src,target=src \
    --mount=type=bind,source=crates,target=crates \
    --mount=type=bind,source=Cargo.toml,target=Cargo.toml,rw \
    --mount=type=bind,source=Cargo.lock,target=Cargo.lock \
    (cd crates/bifrost-frontend && dx bundle --platform web)

# -----------------------------------------------------------------------------
# Packaging stage
# -----------------------------------------------------------------------------
FROM debian:bookworm-slim AS final

COPY --from=build /app/target/release/bifrost /app/bifrost
COPY --from=build /app/target/dx/frontend/release/web/public/ /app/frontend

RUN apt-get -y update && apt-get install -y --no-install-recommends libssl3 ca-certificates

WORKDIR /app

CMD ["/app/bifrost"]
