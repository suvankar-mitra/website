package cc.suvankar.website;

import org.springframework.aot.hint.MemberCategory;
import org.springframework.aot.hint.RuntimeHints;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.aot.hint.TypeReference;
import org.thymeleaf.spring6.view.ThymeleafView;

public class ThymeleafNativeHints implements RuntimeHintsRegistrar {

  @Override
  public void registerHints(RuntimeHints hints, ClassLoader classLoader) {

    // Fix the original ThymeleafView constructor issue
    hints.reflection().registerType(
        ThymeleafView.class,
        MemberCategory.INVOKE_DECLARED_CONSTRUCTORS
    );

    // Thymeleaf dynamically loads these nested classes by name
    hints.reflection().registerType(
        TypeReference.of(
            "org.thymeleaf.spring6.expression.Mvc$Spring41MvcUriComponentsBuilderDelegate"
        ),
        MemberCategory.INVOKE_DECLARED_CONSTRUCTORS
    );

    hints.reflection().registerType(
        TypeReference.of(
            "org.thymeleaf.spring6.expression.Mvc$NonSpring41MvcUriComponentsBuilderDelegate"
        ),
        MemberCategory.INVOKE_DECLARED_CONSTRUCTORS
    );
  }
}