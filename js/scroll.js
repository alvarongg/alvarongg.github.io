const presentacionSection = document.querySelector("#presentationpage");
const habilidadesSection = document.querySelector("#skillspage");
const experienciaSection = document.querySelector("#experiencepage");
const formacionSection = document.querySelector("#studypage");
const proyectosSection = document.querySelector("#projectspage");
const contactoSection = document.querySelector("#contactpage");

document.addEventListener("scroll",function(){
    const clientHeigh = document.documentElement.clientHeight;
    const presentacionY = presentacionSection.getBoundingClientRect().y;
    const habilidadesY = habilidadesSection.getBoundingClientRect().y;
    const experienciaY = experienciaSection.getBoundingClientRect().y;
    const formacionY = formacionSection.getBoundingClientRect().y;
    const proyectosY = proyectosSection.getBoundingClientRect().y;
    const contactoY = contactoSection.getBoundingClientRect().y;

    // console.log(`Pantalla: ${clientHeigh}`);
    // console.log(`Presentacion: ${presentacionY}`);
    // console.log(`Habilidades: ${habilidadesY}`);

    if(contactoY<clientHeigh){
        updateSectionNav(5);
    }else if(proyectosY<clientHeigh){
        updateSectionNav(4);
    }else if(formacionY<clientHeigh){
        updateSectionNav(3);
    }else if(experienciaY<clientHeigh){
        updateSectionNav(2);
    }else if(habilidadesY<clientHeigh){
        updateSectionNav(1);
    }else if(presentacionY<clientHeigh){
        updateSectionNav(0);
    }
});