import React, { ReactNode } from "react";
import {
  apiIcon,
  queryIcon,
  MethodTag,
  datasourceIcon,
} from "../ExplorerIcons";
import { PluginType } from "entities/Action";
import { generateReactKey } from "utils/generators";
import { QUERIES_EDITOR_URL, API_EDITOR_URL } from "constants/routes";
import {
  API_EDITOR_ID_URL,
  QUERIES_EDITOR_ID_URL,
  API_EDITOR_URL_WITH_SELECTED_PAGE_ID,
  QUERY_EDITOR_URL_WITH_SELECTED_PAGE_ID,
} from "constants/routes";

import { Page } from "constants/ReduxActionConstants";
import ExplorerActionsGroup from "./ActionsGroup";
import { ExplorerURLParams } from "../helpers";
import { Datasource } from "api/DatasourcesApi";
import { Plugin } from "api/PluginApi";
import PluginGroup from "../PluginGroup/PluginGroup";

export type ActionGroupConfig = {
  groupName: string;
  type: PluginType;
  icon: JSX.Element;
  key: string;
  getURL: (applicationId: string, pageId: string, id: string) => string;
  generateCreatePageURL: (
    applicationId: string,
    pageId: string,
    selectedPageId: string,
  ) => string;
  getIcon: (method?: string) => ReactNode;
  isGroupActive: (params: ExplorerURLParams, pageId: string) => boolean;
  isGroupExpanded: (params: ExplorerURLParams, pageId: string) => boolean;
};

// When we have new action plugins, we can just add it to this map
// There should be no other place where we refer to the PluginType in entity explorer.
/*eslint-disable react/display-name */
export const ACTION_PLUGIN_MAP: Array<
  ActionGroupConfig | undefined
> = Object.keys(PluginType).map((type: string) => {
  switch (type) {
    case PluginType.API:
      return {
        groupName: "APIs",
        type,
        icon: apiIcon,
        key: generateReactKey(),
        getURL: (applicationId: string, pageId: string, id: string) => {
          return `${API_EDITOR_ID_URL(applicationId, pageId, id)}`;
        },
        getIcon: (method?: string) => {
          if (!method) return apiIcon;
          return <MethodTag type={method} />;
        },
        generateCreatePageURL: API_EDITOR_URL_WITH_SELECTED_PAGE_ID,
        isGroupActive: (params: ExplorerURLParams, pageId: string) =>
          window.location.pathname ===
          API_EDITOR_URL(params.applicationId, pageId),
        isGroupExpanded: (params: ExplorerURLParams, pageId: string) =>
          window.location.pathname.indexOf(
            API_EDITOR_URL(params.applicationId, pageId),
          ) > -1,
      };
    case PluginType.DB:
      return {
        groupName: "DB Queries",
        type,
        icon: queryIcon,
        key: generateReactKey(),
        getURL: (applicationId: string, pageId: string, id: string) =>
          `${QUERIES_EDITOR_ID_URL(applicationId, pageId, id)}`,
        getIcon: () => {
          return queryIcon;
        },
        generateCreatePageURL: QUERY_EDITOR_URL_WITH_SELECTED_PAGE_ID,
        isGroupActive: (params: ExplorerURLParams, pageId: string) =>
          window.location.pathname ===
          QUERIES_EDITOR_URL(params.applicationId, pageId),
        isGroupExpanded: (params: ExplorerURLParams, pageId: string) =>
          window.location.pathname.indexOf(
            QUERIES_EDITOR_URL(params.applicationId, pageId),
          ) > -1,
      };
    default:
      return undefined;
  }
});

// Gets the Actions groups in the entity explorer
// ACTION_PLUGIN_MAP specifies the number of groups
// APIs, Queries, etc.
export const getActionGroups = (
  page: Page,
  step: number,
  actions?: any[],
  searchKeyword?: string,
) => {
  return ACTION_PLUGIN_MAP?.map((config?: ActionGroupConfig) => {
    if (!config || config.type === PluginType.DB) return null;
    const entries = actions?.filter(
      (entry: any) => entry.config.pluginType === config?.type,
    );
    if (!entries || (entries.length === 0 && !!searchKeyword)) return null;

    return (
      <ExplorerActionsGroup
        key={page.pageId + "_" + config.type}
        actions={entries}
        step={step}
        searchKeyword={searchKeyword}
        page={page}
        config={config}
      />
    );
  });
};

export const getPluginGroups = (
  page: Page,
  step: number,
  actions: any[],
  datasources: Datasource[],
  plugins: Plugin[],
  searchKeyword?: string,
) => {
  return ACTION_PLUGIN_MAP?.map((config?: ActionGroupConfig) => {
    if (!config) return null;

    const entries = actions?.filter(
      (entry: any) => entry.config.pluginType === config?.type,
    );

    const filteredPlugins = plugins.filter(
      plugin => plugin.type === config.type,
    );
    const filteredPluginIds = filteredPlugins.map(plugin => plugin.id);
    const filteredDatasources = datasources.filter(datasource => {
      return filteredPluginIds.includes(datasource.pluginId);
    });

    if (
      (!entries && !filteredDatasources) ||
      (entries.length === 0 &&
        filteredDatasources.length === 0 &&
        !!searchKeyword)
    )
      return null;

    return (
      <PluginGroup
        key={page.pageId + "_" + config.type}
        actions={entries}
        datasources={filteredDatasources}
        step={step}
        searchKeyword={searchKeyword}
        page={page}
        actionConfig={config}
      />
    );
  });
};
