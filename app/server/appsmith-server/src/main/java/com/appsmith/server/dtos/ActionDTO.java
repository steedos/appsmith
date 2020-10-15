package com.appsmith.server.dtos;

import com.appsmith.external.models.ActionConfiguration;
import com.appsmith.external.models.Property;
import com.appsmith.server.domains.ActionProvider;
import com.appsmith.server.domains.Datasource;
import com.appsmith.server.domains.Documentation;
import com.appsmith.server.domains.PluginType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Transient;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ActionDTO {

    @Transient
    String applicationId;

    @Transient
    String organizationId;

    @Transient
    PluginType pluginType;

    @Transient
    String pluginId;

    String name;

    Datasource datasource;

    String pageId;

    String collectionId;

    ActionConfiguration actionConfiguration;

    Boolean executeOnLoad;

    /*
     * This is a list of fields specified by the client to signify which fields have dynamic bindings in them.
     * TODO: The server can use this field to simplify our Mustache substitutions in the future
     */
    List<Property> dynamicBindingPathList;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    Boolean isValid;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    Set<String> invalids;


    // This is a list of keys that the client whose values the client needs to send during action execution.
    // These are the Mustache keys that the server will replace before invoking the API
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    Set<String> jsonPathKeys;

    String cacheResponse;

    @Transient
    String templateId; //If action is created via a template, store the id here.

    @Transient
    String providerId; //If action is created via a template, store the template's provider id here.

    @Transient
    ActionProvider provider;

    @JsonIgnore
    Boolean userSetOnLoad = false;

    Boolean confirmBeforeExecute = false;

    @Transient
    Documentation documentation;

    Instant deletedAt = null;

    /**
     * If the Datasource is null, create one and set the autoGenerated flag to true. This is required because spring-data
     * cannot add the createdAt and updatedAt properties for null embedded objects. At this juncture, we couldn't find
     * a way to disable the auditing for nested objects.
     *
     * @return
     */
    public Datasource getDatasource() {
        if (this.datasource == null) {
            this.datasource = new Datasource();
            this.datasource.setIsAutoGenerated(true);
        }
        return datasource;
    }
}
