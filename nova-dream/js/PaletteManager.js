import { Color, MathUtils } from "three";

// ==========================================
// SUPERNOVA — PALETTE MANAGER
// ==========================================

export default class PaletteManager {

    constructor(holdDuration = 15,transitionDuration = 5) {
        this.holdDuration = holdDuration;
        this.transitionDuration = transitionDuration;

        // Each palette contains exactly six colours.
        this.palettes = [
            // SOLAR / RED
            [
                "#ff1600",
                "#ff4500",
                "#ff8c00",
                "#ffcc66",
                "#a80018",
                "#ff3030"
            ],
            // CYAN / BLUE
            [
                "#00f5ff",
                "#008cff",
                "#003cff",
                "#80ffff",
                "#1646a0",
                "#00c9d8"
            ],
            // PURPLE / PINK
            [
                "#a000ff",
                "#ff00cc",
                "#7000d8",
                "#ff66e5",
                "#d8a0ff",
                "#ff286e"
            ],
            // AMBER / GOLD
            [
                "#ffd000",
                "#ff9900",
                "#ffb000",
                "#fff066",
                "#c76b00",
                "#ffe0a0"
            ],
            // MAGENTA / CRIMSON
            [
                "#ff006e",
                "#d00050",
                "#ff1744",
                "#ff6090",
                "#990033",
                "#ff80ab"
            ],
            // ICE / SILVER
            [
                "#ffffff",
                "#c8e6ff",
                "#91bfff",
                "#e0e0e0",
                "#78909c",
                "#a8d8ff"
            ]

        ].map(palette =>
            palette.map(color => new Color(color))
        );

        // Maps each visual system to colours in the master palette.
        this.mappings = {
            particles: [0, 1, 2, 3, 4, 5],
            core:      [0, 2, 4],
            shell:     [0, 2, 4],
            filaments: [1, 3, 5],
            trail:     [0, 2],
            marker:    [1]
        };

        // Cycle state.
        this.currentIndex = 0;
        this.nextIndex = 1 % this.palettes.length;

        this.phase = "hold";
        this.elapsed = 0;

        // The colours currently being displayed.
        this.currentColors = this.palettes[0].map(
            color => color.clone()
        );
    }
    getDuration() {
        return (this.phase === "hold"
        ? this.holdDuration
        : this.transitionDuration);
    }
    transition() {
        this.phase = "transition";
        this.nextIndex = (this.currentIndex + 1) % this.palettes.length;
    }
    hold() {
        this.currentIndex = this.nextIndex;
        this.phase = "hold";
        this.setCurrentPalette();        
    }
    update(dt) {
        if ( dt <= 0 || this.palettes.length < 2 ) return;

        let remaining = dt;
        // Handles large delta times without losing cycle progress.
        while ( remaining > 0 ) {
            const duration = this.getDuration();
            const step = Math.min(remaining, duration - this.elapsed);

            this.elapsed += step;
            remaining -= step;

            if ( this.phase === "transition" )
                this.updateTransition();

            if ( this.elapsed >= duration ) {
                this.elapsed = 0;

                if ( this.phase === "hold" ) 
                    this.transition();
                else
                    this.hold();
            }
        }
    }
    updateTransition() {
        const progress = MathUtils.clamp(
            this.elapsed / this.transitionDuration,
            0,
            1
        );

        // Smoothstep interpolation.
        const t = progress * progress * (3 - 2 * progress);

        const from = this.palettes[this.currentIndex];
        const to = this.palettes[this.nextIndex];

        for ( let i = 0; i < this.currentColors.length; i++ ) {
            this.currentColors[i].lerpColors(from[i], to[i], t);
        }
    }
    setCurrentPalette() {
        const palette = this.palettes[this.currentIndex];

        for ( let i = 0; i < this.currentColors.length; i++ ) {
            this.currentColors[i].copy(palette[i]);
        }
    }
    getColors() {
        return this.currentColors;
    }
    getSystemColors(system) {
        const mapping = this.mappings[system];

        if ( !mapping ) {
            throw new Error(`Unknown palette system: ${system}`);
        }
        return mapping.map(index => this.currentColors[index]);
    }
}
