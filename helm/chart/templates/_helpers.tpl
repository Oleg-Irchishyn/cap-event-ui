{{- define "helper.BuildVersion" -}}
{{ default .Chart.AppVersion .Values.image.version }}
{{- end -}}
