pub struct Sequence {
    counter: u8,
}

impl Sequence {
    #[must_use]
    pub const fn new() -> Self {
        Self { counter: 1 }
    }

    pub const fn reset(&mut self) {
        self.counter = 1;
    }

    pub const fn next(&mut self) -> u8 {
        if self.counter == 15 {
            self.counter = 1;
        } else {
            self.counter += 1;
        }

        self.counter
    }
}

impl Default for Sequence {
    fn default() -> Self {
        Self::new()
    }
}
