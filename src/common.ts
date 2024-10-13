interface About {
    content: string;
}

interface Project {
    name: string;
    description: string;
    id: string;
}

interface Work {
    id: string;
    company: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
}

export {About, Project, Work};
