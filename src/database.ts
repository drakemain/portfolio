import { MongoClient, Db, ServerApiVersion } from 'mongodb';

const ABOUT_COLLECTION_NAME: string = 'about';
const PROJECTS_COLLECTION_NAME: string = 'projects';
const WORK_HISTORY_COLLECTION_NAME: string = 'history';
const CONTENT_DB_NAME: string = 'content';

class DatabaseInterface {
    private uri: string;
    private client: MongoClient;
    private db: Db | null;


    constructor(user: string, password: string) {
        this.uri = `mongodb+srv://${user}:${password}@cluster0.9zaux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
        this.client = new MongoClient(this.uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        this.db = null;
    }

    public async connect() {
        try {
            console.log(this.uri);
            await this.client.connect();
            this.db = this.client.db(CONTENT_DB_NAME);
        } catch(e) {
            throw e;
        }
    }

    public async updateAbout(content: string) {
        const collection = this.db?.collection(ABOUT_COLLECTION_NAME);
        await collection?.updateOne(
            {},
            {$set: {content}},
            {upsert: true}
        );
    }

    public async getAbout(): Promise<string> {
        if (!this.db) {
            throw new Error('DB not connected');
        }
        const collection = this.db.collection(ABOUT_COLLECTION_NAME);
        const result = await collection?.findOne<About>();

        if (!result) {
            throw new Error('Could not find \'about\' section');
        }

        return result.content;
    }

    public async insertProject(project: Project) {
        if (!this.db) {
            throw new Error('DB not connected');
        }
        const collection = this.db.collection(PROJECTS_COLLECTION_NAME);
        await collection?.insertOne(project);
    }

    public async updateProject(project: Project) {
        if (!this.db) {
            throw new Error('DB not connected');
        }
        const collection = this.db.collection<Project>(PROJECTS_COLLECTION_NAME);
        const result = await collection?.updateOne(
            {id: project.id},
            {$set: project},
        );

        console.log(result);
    }

    public async deleteProject(id: string) {
        if (!this.db) {
            throw new Error('DB not connected');
        }
        const collection = this.db.collection<Project>(PROJECTS_COLLECTION_NAME);
        await collection?.deleteOne({id});
    }

    public async getProjects(): Promise<Array<Project>> {
        if (!this.db) {
            throw new Error('DB not connected');
        }
        const collection = this.db.collection<Project>(PROJECTS_COLLECTION_NAME);
        const cursor = collection?.find();
        return cursor.toArray();
    }

    public async insertWork(work: Work) {
        if (!this.db) {
            throw new Error('DB not connected');
        }
        const collection = this.db.collection<Work>(WORK_HISTORY_COLLECTION_NAME);
        await collection?.insertOne(work);
    }

    public async updateWork(work: Work) {
        if (!this.db) {
            throw new Error('DB not connected');
        }
        const collection = this.db.collection(WORK_HISTORY_COLLECTION_NAME);
        await collection?.updateOne(
            {id: work.id},
            {$set: work},
        );
    }

    public async deleteWork(id: string) {
        if (!this.db) {
            throw new Error('DB not connected');
        }
        const collection = this.db.collection<Work>(WORK_HISTORY_COLLECTION_NAME);
        await collection?.deleteOne({id});
    }

    public async getWorkHistory(): Promise<Array<Work>> {
        if (!this.db) {
            throw new Error('DB not connected');
        }
        const collection = this.db.collection<Work>(WORK_HISTORY_COLLECTION_NAME);
        const cursor = collection?.find();
        return cursor.toArray();
    }
}

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

export default DatabaseInterface;
