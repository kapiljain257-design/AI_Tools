TOOL_NAME = 'Indus Report'


def process_tool_request(username, api_key, prompt):
    return f"tool={TOOL_NAME}|username={username}|api_key={api_key}|prompt={prompt}"


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Process tool request')
    parser.add_argument('--username', required=True, help='Username')
    parser.add_argument('--api_key', required=True, help='API key')
    parser.add_argument('--prompt', required=True, help='Prompt text')
    args = parser.parse_args()

    print(process_tool_request(args.username, args.api_key, args.prompt))
