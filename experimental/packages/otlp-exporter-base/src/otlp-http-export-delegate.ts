/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  createOtlpExportDelegate,
  IOtlpExportDelegate,
} from './otlp-export-delegate';
import { OtlpHttpConfiguration } from './configuration/otlp-http-configuration';
import { ISerializer } from '@opentelemetry/otlp-transformer';
import { createHttpExporterTransport } from './transport/http-exporter-transport';
import { createBoundedQueueExportPromiseHandler } from './bounded-queue-export-promise-handler';
import { createRetryingTransport } from './retrying-transport';

export function createOtlpHttpExportDelegate<Internal, Response>(
  options: OtlpHttpConfiguration,
  serializer: ISerializer<Internal, Response>
): IOtlpExportDelegate<Internal> {
  return createOtlpExportDelegate(
    {
      transport: createRetryingTransport({
        transport: createHttpExporterTransport(options),
      }),
      serializer: serializer,
      promiseHandler: createBoundedQueueExportPromiseHandler(options),
    },
    { timeout: options.timeoutMillis }
  );
}
