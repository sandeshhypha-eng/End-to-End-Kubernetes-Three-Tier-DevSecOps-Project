{{- define "backend.name" -}}
{{- default .Chart.Name .Values.nameOverride -}}
{{- end -}}

{{- define "backend.fullname" -}}
{{- printf "%s" (include "backend.name" .) -}}
{{- end -}}
