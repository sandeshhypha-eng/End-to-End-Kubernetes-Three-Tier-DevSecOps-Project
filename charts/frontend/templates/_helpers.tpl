{{- define "frontend.name" -}}
{{- default .Chart.Name .Values.nameOverride -}}
{{- end -}}

{{- define "frontend.fullname" -}}
{{- printf "%s" (include "frontend.name" .) -}}
{{- end -}}
