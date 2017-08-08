module ApplicationHelper
  def markdown(text)
    Redcarpet::Markdown.new(Redcarpet::Render::HTML.new).render(text).html_safe
  end

  def ghost_span(condition, &x)
    content_tag :span, class: condition ? nil : "ghost", &x
  end
end