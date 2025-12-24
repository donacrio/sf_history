# Technical Strategy Workflow

This workflow guides the creation of comprehensive technical implementation plans based on product requirements for frontend applications.

## Context: Frontend Application

This workflow is designed for modern frontend applications with the following considerations:

**Common Tech Stacks:**
- **React** / **Vue** / **Angular** / **Svelte** - Component-based UI framework
- **TypeScript** - Type-safe development
- **State Management** - Redux, Zustand, Pinia, NgRx, or Context API
- **Styling** - CSS Modules, Styled Components, Tailwind CSS, SCSS
- **Build Tools** - Vite, Webpack, or framework-specific bundlers
- **Testing** - Vitest/Jest, React Testing Library, Cypress/Playwright
- **Package Management** - npm, yarn, or pnpm

## Workflow Process

This workflow follows **3 distinct phases**:

### Phase 1: Technical Discovery & Analysis

<instructions>
1. **Summarize** the technical scope back to the user in 2-3 sentences to confirm understanding
2. **Analyze** the codebase and identify the areas where work will have to be done:
   - Use `tree` to explore relevant directory structure
   - READ all files you consider important for this feature
   - Identify which areas will be affected (components, pages, hooks, stores, etc.)
   - Look for existing patterns in the codebase (component structure, state management, API integration, etc.)
   - Check for design system components or UI libraries in use
   - Identify routing and navigation patterns
3. **Identify** existing patterns and conventions in the codebase that should be followed for consistency
   - Component organization (atomic design, feature-based, etc.)
   - TypeScript patterns (types, interfaces, generics)
   - State management patterns (context, global store, local state)
   - Styling conventions (naming, file organization, theming)
   - Testing patterns (component tests, integration tests, mocks)

**Think hard.** Build proper context before moving forward.

Move directly to Phase 2 after this step.
</instructions>

### Phase 2: Technical Discussion & Questions

<instructions>
**Ask targeted technical questions** to gather implementation details, covering:

**Architecture & Components**

- Which EYWA module(s) should own this functionality?
- Are there existing components or utilities that should be reused?
- Does this require cross-module communication?

**Data Modeling & Database**

- What database changes are needed? (PostgreSQL/PostGIS tables, columns, indexes)
- Are there spatial data types involved? (geometry, geography, raster)
- Do we need database migrations?
- What about data seeding or fixtures?

**API Design & Integration**

- REST API endpoints? GraphQL? Internal Python APIs?
- Request/response data structures
- Authentication and authorization requirements
- Integration with external services (AWS, third-party APIs)?

**Spatial Analysis & Processing**

- Geospatial operations required? (buffers, intersections, unions, etc.)
- Coordinate reference systems (CRS) considerations?
- Performance implications of spatial queries?
- Raster or vector data processing?

**Dagster Orchestration** (if applicable)

- Should this be a Dagster asset, op, or job?
- Dependencies on other assets?
- Scheduling and partitioning requirements?
- Data quality checks?

**Performance & Scalability**

- Expected data volumes and query patterns
- Caching strategies
- Background job processing needs
- Database query optimization considerations

**Testing Strategy**

- Unit tests for business logic
- Integration tests with database
- Spatial data test fixtures
- End-to-end testing needs

**Deployment & Infrastructure**

- Environment variables or configuration
- AWS resources needed (S3, Lambda, etc.)
- Database operations (PostGIS extensions, indexes)
- Monitoring and logging requirements

For each question, provide a **recommended answer** or specific direction to guide the user.

**Wait for the user's responses** before proceeding to Phase 3.
</instructions>

### Phase 3: Technical Strategy Generation

<instructions>
1. **Analysis completion**:
   - Analyze the codebase again with the answers provided by the user
   - READ all files you consider important, especially those relevant to the feature or examples of similar functionality
   - Pay special attention to existing patterns in the affected modules

2. **Create a complete Technical Strategy** using the format template below
   - Adapt the template based on the specific task
   - Keep it concise (under ~200 lines)
   - If the feature is large, split into multiple strategy documents (one per independently testable sub-task)

3. **Ensure consistency** with existing codebase patterns and architectural decisions
</instructions>

## Guidelines for Quality Technical Strategies

**Test-Driven Development**

- Begin with a comprehensive testing strategy
- Prioritize integration tests for APIs and data processing
- Implement unit tests for complex business logic or geospatial calculations
- Use pytest fixtures and factory functions for test data

**Data Modeling-First Approach**

- Start with robust domain modeling (database schema, data structures, API contracts)
- Consider PostGIS spatial types and indexes
- Expand outward from the data model

**Incremental Development**

- Decompose implementation into logical, independently testable phases
- Each phase should be deployable and testable

**Path-Specific Implementation**

- Use exact file paths and adhere to established package structure
- Follow Python package naming conventions
- Respect module boundaries in the monorepo

**Maintainability Focus**

- Consistently follow established patterns
- Use type hints extensively
- Write clear docstrings
- Follow Ruff formatting rules

## Technical Strategy Document Template

```markdown
# docs/implementation/STRATEGY_XX_<feature_name>.md

# Technical Strategy

**Feature:** [Feature name from product requirements]
**Module(s):** [atokirina | bmp | commons | eywa | spono | tsaheylu | unobta]
**Related Links:** [Link to specs, Notion, JIRA, etc.]

## Technical Gaps

**What's missing in our current system?**
- Gap 1: [What we can't do today]
- Gap 2: [What we can't do today]
- Gap 3: [What we can't do today]

## Solution Overview

**How we'll build it:**
[2-3 sentences describing the technical approach]

**Key decisions:**
1. [Major technical choice and why]
2. [Major technical choice and why]

## Technical Diagrams

[Include any relevant diagrams, especially sequence diagrams with data flows in mermaid format]

Example:
\`\`\`mermaid
sequenceDiagram
    participant Client
    participant API
    participant Database
    participant PostGIS

    Client->>API: Request spatial analysis
    API->>PostGIS: Execute spatial query
    PostGIS-->>API: Return results
    API-->>Client: Formatted response
\`\`\`

## Testing Strategy

\`\`\`python
# tests/test_<feature>.py
import pytest
from <module>.models import YourModel

def test_feature_creation():
    """Test creating a feature with valid data"""
    pass

def test_spatial_query_performance():
    """Test spatial query returns results within acceptable time"""
    pass

def test_feature_with_invalid_geometry():
    """Test handling of invalid geometries"""
    pass
\`\`\`

## Implementation Overview

### Implementation Files

[Files to create or modify, described as a tree structure]

Example:
```

bmp/
├── src/
│   ├── models/
│   │   └── new_feature.py (CREATE)
│   ├── api/
│   │   └── routes/feature.py (CREATE)
│   └── services/
│       └── feature_service.py (CREATE)
├── tests/
│   ├── test_feature_model.py (CREATE)
│   └── test_feature_api.py (CREATE)
└── alembic/
    └── versions/
        └── xxx_add_feature_table.py (CREATE)

```

### Domain Foundation

**Database Schema:**
```sql
-- New table or modifications
CREATE TABLE IF NOT EXISTS feature_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    geometry GEOMETRY(Point, 4326),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feature_geometry ON feature_table USING GIST(geometry);
```

**Python Models:**

```python
# Location: bmp/src/models/feature.py
from sqlalchemy import Column, String
from geoalchemy2 import Geometry

class Feature(Base):
    __tablename__ = "feature_table"

    id = Column(UUID, primary_key=True)
    name = Column(String(255), nullable=False)
    geometry = Column(Geometry('POINT', srid=4326))
```

**DTOs/Schemas:**

```python
# Location: bmp/src/schemas/feature.py
from pydantic import BaseModel
from typing import Optional

class FeatureCreate(BaseModel):
    name: str
    latitude: float
    longitude: float

class FeatureResponse(BaseModel):
    id: str
    name: str
    # ...
```

### Interfaces

**API Endpoints:**

- `POST /api/v1/features` - Create new feature
- `GET /api/v1/features/{id}` - Get feature by ID
- `GET /api/v1/features/nearby` - Spatial query for nearby features

**Key Implementation Details:**
[Describe important patterns, authentication, error handling, etc.]

### Infrastructure

**Environment Variables:**

```bash
FEATURE_CACHE_TTL=3600
SPATIAL_BUFFER_DISTANCE=1000
```

**Database Operations:**

- Enable PostGIS extension if not already enabled
- Create spatial indexes for performance
- Consider partitioning for large datasets

**AWS Resources:** (if applicable)

- S3 bucket for storing spatial files
- Lambda for background processing

### Standards & Patterns

Follow these coding standards:

**Type Hints:**

- All function signatures must include type hints
- Use `Optional[T]` for nullable values
- Use `list[T]` and `dict[K, V]` for collections (Python 3.11+ syntax)

**Error Handling:**

- Use custom exception classes for domain errors
- Log errors with appropriate context
- Return meaningful error messages to clients

**Testing:**

- Use pytest fixtures for database setup
- Create factory functions for test data
- Test spatial operations with known geometries
- Aim for >80% code coverage

**Docstrings:**

- Use Google-style docstrings
- Document all public functions and classes
- Include type information and examples where helpful

**Code Organization:**

- Keep functions focused and small (<50 lines)
- Extract complex logic into separate functions
- Use dependency injection for services

## Migration Path

[If this changes existing functionality, describe the migration approach]

1. Step 1: [Description]
2. Step 2: [Description]
3. Step 3: [Description]

## Future Enhancements

**Out of scope for this strategy:**

- [Technical improvement not covered]
- [Functional enhancement deferred]
- [Performance optimization to consider later]

## Success Criteria

- [ ] All tests passing
- [ ] Code review approved
- [ ] Database migrations run successfully
- [ ] API documentation updated
- [ ] Performance benchmarks met
- [ ] Deployed to staging and validated

```

</instructions>

---

## User Input

The user will provide a feature description after this prompt. Process it according to Phase 1 first.

**Feature Description:** $ARGUMENTS
