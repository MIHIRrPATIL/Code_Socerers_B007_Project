from flask import Flask, request, jsonify
from flask_cors import CORS
from agents import REAgents
from tasks import RealEstateInsightTasks
from crewai import Crew

# Flask Application Setup
app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_conversation():
    try:
        chat = """
            Client: I'm interested in real estate investment.
            Agent: What type of property are you looking for?
            Client: Something with potential for appreciation in a growing neighborhood.
            Agent: I can suggest some up-and-coming areas.
            """

        if not chat:
            return jsonify({'error': 'Chat conversation is required'}), 400

        # Initialize the agents and tasks
        agents_instance = REAgents()  # FIX: Create an instance of REAgents
        tasks_instance = RealEstateInsightTasks(agents_instance)

        # Create agents inside the instance
        chat_agent = agents_instance.create_chat_insights_agent(chat)
        visualization_agent = agents_instance.create_visualization_agent(chat)

        # Create the Crew instance with agents and tasks
        crew = Crew(
            agents=[chat_agent, visualization_agent],  # FIX: Pass initialized agent instances
            tasks=tasks_instance.get_all_tasks(chat),
            verbose=True
        )
        
        final_insight = crew.kickoff()
        return jsonify({
            'report': str(final_insight),
            'message': 'Analysis complete'
        }), 200

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error for debugging
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5002)
