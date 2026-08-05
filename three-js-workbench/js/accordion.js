import { byQsArray, byQs } from "./functions.js";

export default class Accordion {

    constructor(selector) {
        this.sections = [...byQsArray(`${selector} .section`)];
        this.sections.forEach(section => {
            const heading = byQs("h4", section);
            heading.addEventListener("click", () => this.open(section));
        });

        if ( this.sections.length )
            this.open(this.sections[0]);
    }

    open(activeSection) {
        this.sections.forEach(section =>
            section.classList.toggle("active", section === activeSection)
        );
    }
}
