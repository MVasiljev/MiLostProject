use super::operators::Operator;

#[derive(Clone)]
pub enum ExprKind {
    Literal(String),
    Pattern(String),
    StartCapture,
    EndCapture,
    StartGroup,
    EndGroup,
    Empty,
    Transform(Box<Expr>, fn(String) -> String),
    Conditional(Box<Expr>, fn(&str) -> bool),
    Replacement(Box<Expr>, String),
}

#[derive(Clone)]
pub struct Expr {
    pub kind: ExprKind,
    pub op: Operator,
    pub quantifier: Option<String>,
    pub name: Option<String>, 
}

impl Expr {
    pub fn add_quantifier(&mut self, quantifier: String) {
        self.quantifier = Some(quantifier);
    }

    pub fn to_regex(&self) -> String {
        let base = match &self.kind {
            ExprKind::Literal(text) => text.clone(),
            ExprKind::Pattern(pattern) => pattern.clone(),
            ExprKind::StartCapture => "(".to_string(),
            ExprKind::EndCapture => ")".to_string(),
            ExprKind::StartGroup => "(?:".to_string(),
            ExprKind::EndGroup => ")".to_string(),
            ExprKind::Empty => "".to_string(),
            ExprKind::Transform(expr, _) => expr.to_regex(),
            ExprKind::Conditional(expr, _) => expr.to_regex(),
            ExprKind::Replacement(expr, _) => expr.to_regex(),
        };

        let base = if let Some(name) = &self.name {
            format!("(?P<{}>{})", name, base)
        } else {
            base
        };

        if let Some(quant) = &self.quantifier {
            format!("{}{}", base, quant)
        } else {
            base
        }
    }

    pub fn apply_transform(&self, text: &str) -> String {
        match &self.kind {
            ExprKind::Transform(_, transformer) => transformer(text.to_string()),
            _ => text.to_string(),
        }
    }

    pub fn check_condition(&self, text: &str) -> bool {
        match &self.kind {
            ExprKind::Conditional(_, condition) => condition(text),
            _ => true,
        }
    }
}