import { FilePerson, FilePersonFill } from "react-bootstrap-icons";

export type ChatMessageType =
    'function'          // A message that represents a function that ChatGPT can use
    | 'system'          // An internal message sent to ChatGPT to set the context of what the session is about. In this app, it's used to set the "persona" of the system.
    | 'user'            // Message that a user typed in
    | 'assistant'       // A response from ChatGPT
    | 'localAssistant'  // A message displayed to the user but isn't sent to ChatGPT, like a welcome message
    | 'tool'            // A message that represents a tool that ChatGPT can use

export interface ChatMessage {
    isLoading: boolean;
    role: ChatMessageType;
    content?: string;
    name?: string;
    isEnvVarError?: boolean;
}

export interface SystemChatCardProps {
    isLoading: boolean;
    messageType: ChatMessageType;
    content?: string;
    isEnvVarError?: boolean;
}

export const ChatCard = (props: SystemChatCardProps) => {
    const { isLoading, content, messageType, isEnvVarError } = props;

    const isBotPrompt = messageType === 'assistant' || messageType === 'localAssistant' || messageType === 'function';

    const getEnvVarErrorCard = () => {
        return <div className='row'>
            <div className='col-sm-1'><FilePerson size={48} className='person-icon' /></div>
            <div className='card border-primary mb-3 col-sm-10'>
                <div className="card-body">
                    <p className="card-text">It looks like you do not have your OpenAIKey set in your environment variables. To get an OpenAIKey, do the following:</p>
                    <ol>
                        <li><b>Create an OpenAI Account:</b> If you don't already have an account, go to <a href="https://www.openai.com/" target="_blank" rel="noreferrer">OpenAI's website</a> and sign up for one.</li>
                        <li><b>Log In to Your Account:</b> If you already have an account, simply log in.</li>
                        <li><b>Navigate to API Section:</b>
                            <ul>
                                <li>Once logged in, go to the OpenAI dashboard. You can find it by clicking on your profile or directly navigating to <a href="https://platform.openai.com/" target="_blank" rel="noreferrer">OpenAI Platform.</a></li>
                                <li>Look for a section or tab labeled "API" or "API Keys".</li>
                            </ul>
                        </li>
                        <li><b>Generate a New API Key</b>
                            <ul>
                                <li>In the API section, there should be an option to create a new API key.</li>
                                <li>Click on the button to generate a new key. This will create a unique API key for you to use.</li>
                            </ul>
                        </li>
                        <li><b>Save Your API Key:</b> Make sure to copy and securely store your API key. For security reasons, you will not be able to view the key again once you navigate away from the page.</li>
                    </ol>
                    <p className="card-text">Once you have your API key, you'll need to add it to your app as an environment variable:</p>
                    <ul>
                        <li><b>For local development:</b>Add a .env file to the root of your server directory with a key of OPENAI_API_KEY, and a value of your Open AI API Key</li>
                        <li><b>For your App Space in Azure:</b>
                            <ol>
                                <li>Open the Azure Portal and navigate to your App Space</li>
                                <li>Click on your backend App Clomponent and navigate to the "Settings" tab</li>
                                <li>Add a new secret with a key of "openaisecret", paste the value of your open AI key that you generated earlier, and save.</li>
                                <li>Add an environment with the key name of OPENAI_API_KEY, and a value which references the secret named "openaisecret"</li>
                            </ol>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    }

    const getTextCard = () => {
        const className = isBotPrompt
            ? 'card border-primary mb-3 col-sm-10'
            : 'card text-white bg-primary mb-3 col-sm-10';

        return <div className={className}>
            <div className="card-body">
                <pre><p className="card-text">{content}</p></pre>
            </div>
        </div>
    }

    const getUserCard = () => {
        return <div className='row'>
            <div className='col-sm-1'></div>
            {getTextCard()}
            <div className='col-sm-1'><FilePersonFill size={48} className='person-icon' /></div>
        </div>
    }

    const getSystemCard = () => {
        const getLoadingCard = () => {
            return <div className="col-sm-10" style={{ marginTop: '-10px' }}>
                <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden"></span>
                </div>
                <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden"></span>
                </div>
                <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>;
        }

        const loadingOrTextCard = isLoading ? getLoadingCard() : getTextCard();

        return <div className='row'>
            <div className='col-sm-1'><FilePerson size={48} className='person-icon' /></div>
            {loadingOrTextCard}
        </div>;
    }

    let card: JSX.Element = <div></div>;

    if (isEnvVarError) {
        card = getEnvVarErrorCard();
    } else if (isBotPrompt) {
        card = getSystemCard();
    } else {
        card = getUserCard();
    }

    return <div className='row'>
        {card}
    </div>;

}