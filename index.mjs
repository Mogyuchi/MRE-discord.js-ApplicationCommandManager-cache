import assert from "node:assert/strict";
import test from "node:test";
import { setTimeout } from "node:timers/promises";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
// Node.js 21.x, `assert` -> `with`
import config from "./config.json" assert { type: "json" };
import ora from 'ora';
/**
 * @typedef {import('discord.js').RESTPostAPIChatInputApplicationCommandsJSONBody} RESTPostAPIChatInputApplicationCommandsJSONBody
 * @typedef {import('discord.js').ForumChannel} ForumChannel
 */

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/**
 * `test1` command definition
 * @satisfies {RESTPostAPIChatInputApplicationCommandsJSONBody}
 */
const test1 = {
	name: "test1",
	description: "test1",
};
/**
 * `test2` command definition
 * @satisfies {RESTPostAPIChatInputApplicationCommandsJSONBody}
 */
const test2 = {
	name: "test2",
	description: "test2",
};

client.once(Events.ClientReady, async (client) => {
	const spinner = ora().start()
	await client.application.commands.set([test1, test2]);
	await client.application.commands.set([test1]);
	const fetchData = await client.application.commands.fetch()
	const beforeClear = new Collection(client.application.commands.cache);
	client.application.commands.cache.clear();
	await client.application.commands.set([test1]);
	const afterClear = new Collection(client.application.commands.cache);
	await client.destroy();
spinner.stop()
	test("fetch data equal cache", async () => {
		assert.deepStrictEqual(fetchData, beforeClear);
	});
	test("we need cache clear", async () => {
		assert.deepStrictEqual(fetchData, afterClear);
	});
});

client.login(config.token);
