# Backend Folder Renaming Guide

## Current Status
The backend services are currently named:
```
backend/
├── tool-service-1  → should be "nova"
├── tool-service-2  → should be "indus-report"
├── tool-service-3  → should be "perfectto"
├── tool-service-4  → should be "repro-tool"
└── tool-service-5  → should be "image-generator"
```

## How to Rename Folders

### Option 1: Using Terminal Commands

```bash
# Navigate to backend directory
cd /workspaces/Microservce_tool/backend

# Rename the folders
mv tool-service-1 nova
mv tool-service-2 indus-report
mv tool-service-3 perfectto
mv tool-service-4 repro-tool
mv tool-service-5 image-generator

# Verify the changes
ls -la
```

Expected result:
```
api-gateway/
nova/
indus-report/
perfectto/
repro-tool/
image-generator/
backend/ (existing folder - can be removed if not needed)
```

### Option 2: Using VS Code File Explorer

1. Right-click on `tool-service-1` folder
2. Select "Rename"
3. Type `nova`
4. Press Enter
5. Repeat for other folders

## Important Considerations

### No Code Changes Needed
The API Gateway `constants.js` already references tools by their new names:
- Tool IDs: `nova`, `indus-report`, `perfectto`, `repro-tool`, `image-generator`
- Tool ports: `5001`, `5002`, `5003`, `5004`, `5005` (unchanged)

The port mappings remain the same, so no changes needed in the service files.

### Folder Structure is Fine Either Way
The current implementation uses port numbers to communicate with services, not folder names. However, renaming improves:
- Code readability
- Maintainability
- Team understanding of what each service does

## After Renaming

No other changes required:
- API Gateway will still work
- Frontend will still work
- All services continue running on the same ports
- Communication continues via localhost:PORT

## Reverse the Changes (If Needed)

If you need to revert:
```bash
cd /workspaces/Microservce_tool/backend

# Rename back to original names
mv nova tool-service-1
mv indus-report tool-service-2
mv perfectto tool-service-3
mv repro-tool tool-service-4
mv image-generator tool-service-5
```

## Recommended Naming Convention

### Tool Services
- Use hyphens for multi-word names: `indus-report`, `repro-tool`
- Use single words where possible: `nova`, `perfectto`
- Avoid uppercase in folder names

### Internal Documentation
Create a `SERVICES.md` file in the backend folder:

```markdown
# Backend Service Mapping

| Service Name | Folder Name | Port | Purpose |
|---|---|---|---|
| Nova | nova | 5001 | Advanced text processing |
| Indus Report | indus-report | 5002 | Data analysis and reporting |
| Perfectto | perfectto | 5003 | QA and optimization |
| Repro Tool | repro-tool | 5004 | Testing and reproduction |
| Image Generator | image-generator | 5005 | AI image generation |
```

## Verification Steps

After renaming, verify everything still works:

1. **Start API Gateway**:
   ```bash
   cd /workspaces/Microservce_tool/backend/api-gateway
   npm start
   # Should output: API Gateway running on 5000
   ```

2. **Start a service** (for example):
   ```bash
   cd /workspaces/Microservce_tool/backend/nova
   node index.js
   # Should output: Tool listening on port 5001
   ```

3. **Test the API Gateway**:
   ```bash
   curl http://localhost:5000/api/tools
   # Should return all tools with renamed IDs
   ```

4. **Check tool status**:
   ```bash
   curl http://localhost:5000/api/tools/nova/status
   # Should return: {"active": true}
   ```

## Optional: Update Package.json Names

If individual services have their own package.json files, you can optionally update the `"name"` field:

```json
{
  "name": "tda-nova-service",
  "version": "1.0.0",
  "description": "Advanced text processing service",
  ...
}
```

But this is optional and doesn't affect functionality.

## Summary

✅ **Safe to Rename**: Folder names don't affect the API, just organization
✅ **Easy to Revert**: Simple mv commands to change back
✅ **Improves Clarity**: Makes it obvious what each service does
✅ **No Code Changes**: All references are via port numbers, not folder names
