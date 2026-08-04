export default class Accordion {

    constructor(selector) {

        this.sections = [...document.querySelectorAll(`${selector} .section`)];

        this.sections.forEach(section => {

            const heading = section.querySelector("h4");

            heading.addEventListener("click", () => this.open(section));

        });

        if (this.sections.length)
            this.open(this.sections[0]);
    }

    open(activeSection) {

        this.sections.forEach(section =>
            section.classList.toggle("active", section === activeSection)
        );

    }

}
